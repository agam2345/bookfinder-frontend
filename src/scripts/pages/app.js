import { getActiveRoute, parseActivePathname} from "../routes/url-parser";
import routes from "../routes/routes";
import { getAccessToken, getLogout } from "../utils/auth";
import {
  generateAuthenticatedNavigationListTemplate,
  generateFilterFormTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../template";
import { matchRoute } from "../routes/routes";

import { initDb } from "../data/indexeddb";

export default class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #navigationSkipContent = null;


  constructor({ content, drawerButton, navigationDrawer, navigationSkipContent }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navigationSkipContent =navigationSkipContent;
    this._setupDrawer();
    this._initializeIndexedDB();
  }

  async _initializeIndexedDB() {
    await initDb();
  }

  async renderPage() {
    const url = getActiveRoute();
    const routeHandler = matchRoute(url);
    console.log("urlny", parseActivePathname().id);
    console.log('url matchnya', routeHandler);

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
      url === "/onboarding/genre" ||
      url === "/progress" ||
      url === "/selesai"
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
    this._updateSkipLink(url);

    // Sembunyikan drawer button di halaman onboarding
    if (url === "/onboarding/mood" || url === "/onboarding/genre") {
      this.#drawerButton.classList.add("d-none");
    } else {
      this.#drawerButton.classList.remove("d-none");
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
    <li><a href="#/progress">Progress</a></li>
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
  
    _updateSkipLink(url) {
      if (!this.#navigationSkipContent) return;
    
      if (url === '/') {
        this.#navigationSkipContent.setAttribute('href', '#book-items');
      } else if (url === '/progress') {
        this.#navigationSkipContent.setAttribute('href', '#progress-container-books');
      } else if (url === '/selesai') {
        this.#navigationSkipContent.setAttribute('href', '#finished-books-list');
      } else if(url === '/login') {
        this.#navigationSkipContent.setAttribute('href', '#login-form');
      }
      else if(url === '/register') {
        this.#navigationSkipContent.setAttribute('href', '#register-form');
      }else if(url === '/onboarding/genre') {
        this.#navigationSkipContent.setAttribute('href', '#onboarding-container');
      }else if(url === '/onboarding/mood') {
        this.#navigationSkipContent.setAttribute('href', '#onboarding-container');
      }else if(url === `/books/${parseActivePathname().id}`) {
        this.#navigationSkipContent.setAttribute('href', '#detailBooks');
      }
      
    
      this.#navigationSkipContent.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' }); 
          targetElement.focus(); 
          this.#navigationSkipContent.blur();
        } else {
          console.error('Target element not found!');
        }
      });
    }

}
