import { getActiveRoute } from "../routes/url-parser";
import routes from "../routes/routes";
import { getAccessToken, getLogout } from "../utils/auth";
import {
  generateAuthenticatedNavigationListTemplate,
  generateFilterFormTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../template";

export default class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  async renderPage() {
    const url = getActiveRoute();
    const routeHandler = routes[url];

    if (!routeHandler) {
      this.#content.innerHTML = "<p>404 Halaman tidak ditemukan</p>";
      return;
    }

    // Cek halaman onboarding
    if (url === "/onboarding") {
      this.#content.innerHTML = `
            <div id="onboarding-container">
                <h2 id="form-title"></h2>
                <form id="onboarding-form"></form>
                <div class="form-navigation">
                    <button id="back-btn" class="btn" style="display:none;">Back</button>
                    <button id="skip-btn" class="btn">Skip</button>
                    <button id="next-btn" class="btn">Next</button>
                </div>
            </div>
        `;

      const view = new OnboardingPage();
      const presenter = new OnboardingPresenter(view);
      presenter.init();

      return;
    }

    const page =
      typeof routeHandler === "function" ? routeHandler() : routeHandler;

    if (!page) return;

    const html = await page.render();
    this.#content.innerHTML = html;
    // Sembunyikan elemen pada halaman login/register/onboarding mood dan genre
    if (
      url === "/login" ||
      url === "/register" ||
      url === "/onboarding/mood" ||
      url === "/onboarding/genre"
    ) {
      document.querySelector(".input-group")?.classList.add("d-none"); // sembunyikan pencarian
      document.getElementById("filter-drawer")?.classList.add("d-none"); // sembunyikan filter
    } else {
      document.querySelector(".input-group")?.classList.remove("d-none");
      document.getElementById("filter-drawer")?.classList.remove("d-none");
    }

    new SlimSelect({ select: "#select-mood" });
    new SlimSelect({ select: "#select-genre" });

    this.#setupNavigationList();

    // Tunggu sampai DOM sudah terisi sebelum afterRender()
    await page.afterRender();

    // Sembunyikan drawer button di halaman onboarding
    if (url === "/onboarding/mood" || url === "/onboarding/genre") {
      this.#drawerButton.style.display = "none";
    } else {
      this.#drawerButton.style.display = "block";
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (
        !this.#drawerButton.contains(event.target) &&
        !this.#navigationDrawer.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }
    });
  }
  #setupNavigationList() {
    const navList = document.getElementById("navlist");

    // Bersihkan isi navList terlebih dahulu
    navList.innerHTML = "";
    const url = getActiveRoute();

    // Jika halaman onboarding, kosongkan dan sembunyikan navList
    const isOnboarding =
      url === "/onboarding" ||
      url === "/onboarding/mood" ||
      url === "/onboarding/genre";

    if (isOnboarding) {
      navList.classList.add("d-none");
      return;
    } else {
      navList.classList.remove("d-none");
    }

    const isLoginOrRegister = url === "/login" || url === "/register";

    if (isLoginOrRegister) {
      // Hanya tampilkan tombol Login dan Register saat di halaman login/register
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    // Jika user login, tampilkan tombol logout, filter, dll
    navList.innerHTML = `
    <li><a href="#/">Beranda</a></li>
    <li><a href="#/selesai">Selesai dibaca</a></li>
    <li><a href="#/profile">Profile</a></li>
    <li id="filter-drawer"><a href="#"><i class="fas fa-filter"></i>Filter</a></li>
  `;

    // Tambahkan tombol logout
    const logoutItem = document.createElement("li");
    logoutItem.innerHTML = `
    <a id="logout-button" class="logout-button" href="#/logout">
        <i class="fas fa-sign-out-alt"></i> Logout
    </a>
  `;
    navList.appendChild(logoutItem);

    // Event untuk tombol logout
    const logoutButton = logoutItem.querySelector("#logout-button");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (!getAccessToken()) {
        alert("Anda belum login.");
        location.hash = "/login";
        return;
      }
      if (confirm("Apakah Anda yakin ingin keluar?")) {
        getLogout();
        location.hash = "/login";
      }
    });
  }
}
