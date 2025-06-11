import { BookProgressDB } from "../../data/indexeddb";
import {
  generateProgressBookItemTemplate,
  generateProgressHeaderTemplate,
  generateUpdateProgressModalTemplate,
} from "../../template";
import Chart from "chart.js/auto";

export default class ProgressPresenter {
  #view;
  #userId;
  #chartInstance = null;

  constructor({ view, userId }) {
    this.#view = view;
    this.#userId = userId;
  }

  async init() {
    await this._renderProgressPage();
    this._attachEventListeners();
  }

  async _renderProgressPage() {
    const allProgress = await BookProgressDB.getAllUserBookProgress(
      this.#userId
    );

    const readingBooks = allProgress.filter(
      (book) => book.status === "reading"
    );
    const finishedBooks = allProgress.filter(
      (book) => book.status === "finished"
    );

    const username = localStorage.getItem("username") || "Pengguna";

    this.#view.innerHTML = generateProgressHeaderTemplate(
      readingBooks.length,
      finishedBooks.length,
      username
    );

    // Render list progress buku
    const bookProgressListContainer = this.#view.querySelector(
      "#book-progress-list"
    );
    if (bookProgressListContainer) {
      const progressHTML = readingBooks
        .map((book) =>
          generateProgressBookItemTemplate({
            id: book.id_buku,
            title: book.judul_buku,
            total_pages: book.total_halaman,
            current_page: book.halaman_saat_ini,
            percentage: book.persentase_progress,
          })
        )
        .join("");
      bookProgressListContainer.innerHTML = progressHTML;
    }

    // Render grafik
    await this._renderChart();
  }

  async _renderChart(month = null, year = null) {
    const chartCanvas = this.#view.querySelector("#progress-chart");
    if (!chartCanvas) return;

    if (this.#chartInstance) {
      this.#chartInstance.destroy();
    }

    const today = new Date();
    if (!month) month = today.getMonth() + 1;
    if (!year) year = today.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1)
      .toISOString()
      .split("T")[0];
    const endOfMonth = new Date(year, month, 0).toISOString().split("T")[0];

    const dailyLogs = await BookProgressDB.getDailyReadingLogs(
      this.#userId,
      startOfMonth,
      endOfMonth
    );

    const labels = [];
    const data = [];
    let accumulatedPages = 0;

    // Generate labels : setiap hari dalam sebulan
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      labels.push(String(i));

      const log = dailyLogs.find((log) => log.tanggal === dateString);

      // if (log) {
      //   accumulatedPages += log.halaman_dibaca_pada_tanggal_ini;
      // }
      // data.push(accumulatedPages);
      data.push(log ? log.halaman_dibaca_pada_tanggal_ini : 0);
    }

    const yearSelect = this.#view.querySelector("#chart-filter-year");
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    yearSelect.innerHTML = '<option value="">Pilih Tahun</option>';
    for (let y = startYear; y <= endYear; y++) {
      const selected = y === year ? "selected" : "";
      yearSelect.innerHTML += `<option value="${y}" ${selected}>${y}</option>`;
    }

    this.#view.querySelector("#chart-filter-month").value = month;
    this.#view.querySelector("#chart-filter-year").value = year;

    this.#chartInstance = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Halaman Akumulasi Dibaca",
            data: data,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Progress Harian Bulan ${new Date(
              year,
              month - 1,
              1
            ).toLocaleString("id-ID", { month: "long" })} ${year}`,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Tanggal",
            },
          },
          y: {
            title: {
              display: true,
              text: "Jumlah Halaman",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  _attachEventListeners() {
    this.#view.addEventListener("click", async (event) => {
      if (event.target.classList.contains("btn-update-progress")) {
        const bookId = event.target.dataset.id;
        const bookTitle = event.target.dataset.title;
        await this._showUpdateProgressModal(bookId, bookTitle);
      }
    });

    // Event listener : filter grafik
    this.#view
      .querySelector("#chart-filter-month")
      ?.addEventListener("change", (event) => this._handleChartFilterChange());
    this.#view
      .querySelector("#chart-filter-year")
      ?.addEventListener("change", (event) => this._handleChartFilterChange());
  }

  _handleChartFilterChange() {
    const month =
      parseInt(this.#view.querySelector("#chart-filter-month").value) || null;
    const year =
      parseInt(this.#view.querySelector("#chart-filter-year").value) || null;
    this._renderChart(month, year);
  }

  async _showUpdateProgressModal(bookId, bookTitle) {
    const modalHTML = generateUpdateProgressModalTemplate(bookTitle);
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("update-progress-modal");
    const confirmButton = document.getElementById("confirm-update-progress");
    const cancelButton = document.getElementById("cancel-update-progress");
    const pagesReadInput = document.getElementById("pages-read-input");

    modal.classList.add("active");

    const currentProgress = await BookProgressDB.getBookProgress(
      this.#userId,
      bookId
    );
    if (currentProgress) {
      pagesReadInput.max =
        currentProgress.total_halaman - currentProgress.halaman_saat_ini;
    }

    confirmButton.onclick = async () => {
      const pagesRead = parseInt(pagesReadInput.value, 10);

      if (isNaN(pagesRead) || pagesRead <= 0) {
        alert("Masukkan jumlah halaman yang valid.");
        return;
      }

      if (
        pagesRead >
        currentProgress.total_halaman - currentProgress.halaman_saat_ini
      ) {
        alert(
          `Anda tidak bisa membaca lebih dari sisa halaman yang ada (${
            currentProgress.total_halaman - currentProgress.halaman_saat_ini
          } halaman).`
        );
        return;
      }

      modal.classList.remove("active");
      modal.remove();

      try {
        const updatedHalamanSaatIni =
          currentProgress.halaman_saat_ini + pagesRead;
        const newPercentage =
          (updatedHalamanSaatIni / currentProgress.total_halaman) * 100;
        const newStatus = newPercentage >= 100 ? "finished" : "reading";

        await BookProgressDB.addOrUpdateBookProgress({
          id_buku: bookId,
          id_pengguna: this.#userId,
          judul_buku: bookTitle,
          total_halaman: currentProgress.total_halaman,
          halaman_saat_ini: updatedHalamanSaatIni,
          persentase_progress: Math.min(
            100,
            parseFloat(newPercentage.toFixed(2))
          ),
          status: newStatus,
          tanggal_selesai:
            newStatus === "finished" && !currentProgress.tanggal_selesai
              ? new Date().toISOString().split("T")[0]
              : currentProgress.tanggal_selesai,
        });

        // Update daily reading log
        const today = new Date().toISOString().split("T")[0];
        await BookProgressDB.addOrUpdateDailyReadingLog(
          this.#userId,
          today,
          pagesRead
        );

        alert("Progress berhasil diupdate!");
        await this._renderProgressPage();
      } catch (error) {
        console.error("Gagal mengupdate progress:", error);
        alert("Gagal mengupdate progress: " + error.message);
      }
    };

    cancelButton.onclick = () => {
      modal.classList.remove("active");
      modal.remove();
    };
  }
}
