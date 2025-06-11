export function generateFilterFormTemplate() {
  return `
    <div id="filter-panel" class="filter-panel">
            <div class="filter-head"> 
                <h1>Filter Buku</h1>
                <button id="close-filter" class="close-btn">&times;</button>
            </div>
            <div class="filter-content">
                <form id="form-filter">
                <section>
                    <p>Bagaimana Perasaan Anda?</p>
                    <select id="select-mood">
                    <option value="">Pilih</option>
                    <option value="excited">Excited</option>
                    <option value="angry">Angry</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="neutral">Neutral</option>
                    </select>
                </section>
                <section>
                    <p>Genre buku apa yang Anda ingin baca?</p>
                    <select id="select-genre">
                    <option value="">Pilih</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Nonfiction">Nonfiction</option>
                    <option value="Children's Fiction">Children's Fiction</option>
                  
                    </select>
                </section>
                 <div id="submit-button-container">
                    <button class="btn" type="submit">Terapkan</button>
                </div>
                </form>
            </div>
            </div>  
       </div>
    `;
}
export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <div class="auth-buttons">
      <li><a id="login-button" href="#/login">Login</a></li>
      <li><a id="register-button" href="#/register">Register</a></li>
    </div>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateBookItemTemplate({
  id,
  title,
  description_cleaned,
  average_rating,
  thumbnail,
  num_pages,
}) {
  return `
    <div tabindex="0" class="book-card book-item" data-bookid="${id}">
     <img src="${thumbnail}" alt="${title}" class="book-item__thumbnail">
      <div class="book-item__body">
        <div class="book-item__main">
          <h2 class="book-item__title">${title}</h2>
          <div class="book-item__rating">
            <i class="fas fa-star"></i> ${average_rating ?? "N/A"}
          </div>
        </div>
        <div class="book-item__description">
          ${description_cleaned}
        </div>
        <div class="book-item__actions">
          <button class="btn btn-progress" data-id="${id}" data-title="${title}" data-numPages="${num_pages}">Buat Progress</button> 
          <a class="btn book-item__read-more" href="#/books/${id}">
            Selengkapnya <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

export const createBookDetailTemplate = (book) => `
  <h2 class="book__title">${book.title}</h2>
  <div class="detail_book_body"> 
  <img class="book__cover" src="${book.thumbnail}" alt="${book.title}" />
  <div class="book__info">
    <h3>Information</h3>
    <h4>Penulis</h4>
    <p>${book.authors}</p>
    <h4>Katagori</h4>
    <p>${book.simple_categories}</p>
    <h4>Mood</h4>
    <p>${book.emotion_simple}</p>
    <h4>Tahun Publikasi</h4>
    <p>${book.published_year}</p>
    <h4>Halaman</h4>
    <p>${book.num_pages} pages</p>
    <h4>Rating</h4>
    <p><i class="fas fa-star"></i> ${book.average_rating}</p>
  </div>
  </div>
  <div class="book__description">
    <h3>Description</h3>
    <p>${book.description_cleaned}</p>
  </div>
`;

export function indikatorLoading() {
  return `
  <div class="loading-overlay" id="loading-overlay">
    <div class="spinner"></div>
  </div>
`;
}

export function generateCreateProgressModalTemplate(bookTitle, numPages) {
  return `
    <div class="modal-overlay" id="create-progress-modal">
      <div class="modal-content">
        <h2>Buat Progress Membaca</h2>
        <p>Apakah Anda yakin ingin membuat progress untuk buku:</p>
        <p><strong>${bookTitle}</strong>?</p>
        <p>Total halaman: ${numPages}</p>
        <div class="modal-actions">
          <button id="confirm-create-progress" class="btn btn-primary">Ya, Buat Progress</button>
          <button id="cancel-create-progress" class="btn btn-secondary">Batal</button>
        </div>
      </div>
    </div>
  `;
}

export function generateUpdateProgressModalTemplate(bookTitle) {
  return `
    <div class="modal-overlay" id="update-progress-modal">
      <div class="modal-content">
        <h2>Update Progress: ${bookTitle}</h2>
        <p>Inputkan halaman yang telah selesai dibaca:</p>
        <input type="number" id="pages-read-input" min="1" placeholder="Jumlah halaman">
        <div class="modal-actions">
          <button id="confirm-update-progress" class="btn btn-primary">Simpan Progress</button>
          <button id="cancel-update-progress" class="btn btn-secondary">Batal</button>
        </div>
      </div>
    </div>
  `;
}

export function generateProgressBookItemTemplate({
  id,
  title,
  total_pages,
  current_page,
  percentage,
}) {
  return `
    <div class="progress-book-item" data-bookid="${id}">
      <h3>${title}</h3>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentage}%;"></div>
      </div>
      <div class="progress-info">
        <span>${current_page} / ${total_pages} halaman</span>
        <span>${percentage}%</span>
      </div>
      <button class="btn btn-sm btn-update-progress" data-id="${id}" data-title="${title}">Update Progress</button>
    </div>
  `;
}

export function generateProgressHeaderTemplate(
  readingCount,
  finishedCount,
  username
) {
  return `
        <div class="progress-header">
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-number">${readingCount}</span>
                    <span class="stat-label">Buku Sedang Dibaca</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${finishedCount}</span>
                    <span class="stat-label">Buku Selesai Dibaca</span>
                </div>
            </div>
            <div class="user-info">
                <span>Info Pengguna: <strong>${username}</strong></span>
            </div>
        </div>
        <div class="progress-chart-container">
            <h2>Grafik Progress Harian</h2>
            <div class="chart-controls">
                <select id="chart-filter-month">
                    <option value="">Pilih Bulan</option>
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                </select>
                <select id="chart-filter-year">
                    <option value="">Pilih Tahun</option>
                    </select>
            </div>
            <canvas id="progress-chart"></canvas>
        </div>
        <div class="progress-list-section">
            <h2>Progress Baca Buku</h2>
            <div id="book-progress-list">
                </div>
        </div>
    `;
}

export function generateFinishedBookItemTemplate({
  id_buku,
  judul_buku,
  thumbnail,
  authors,
  total_halaman,
  halaman_saat_ini,
  tanggal_selesai,
}) {
  return `
    <div class="finished-book-item" data-book-id="${id_buku}">
      <img src="${thumbnail}" alt="${judul_buku}" class="finished-book-item__thumbnail"> <div class="finished-book-item__details">
        <h3 class="finished-book-item__title">${judul_buku}</h3>
        <p class="finished-book-item__authors">Oleh: ${
          authors || "Anonim"
        }</p> <p>Total Halaman: ${total_halaman}</p>
        <p>Halaman Terakhir: ${halaman_saat_ini}</p>
        <p>Selesai Membaca: ${tanggal_selesai || "N/A"}</p>
        </div>
    </div>
  `;
}
