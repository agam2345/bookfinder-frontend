    import { getActiveRoute } from "../routes/url-parser";
    import routes from "../routes/routes";
    import { getAccessToken, getLogout } from "../utils/auth";
    import { generateAuthenticatedNavigationListTemplate, 
            generateFilterFormTemplate,
            generateUnauthenticatedNavigationListTemplate } from "../template";

    export default class App{
        #content;
        #drawerButton;
        #navigationDrawer;

        constructor({content, drawerButton, navigationDrawer}){
            this.#content = content;
            this.#drawerButton = drawerButton;
            this.#navigationDrawer = navigationDrawer;
            this._setupDrawer();
        }

async renderPage() {
    const url = getActiveRoute();
    const routeHandler = routes[url];

    if (!routeHandler) {
        this.#content.innerHTML = '<p>404 Halaman tidak ditemukan</p>';
        return;
    }

    const page = typeof routeHandler === 'function' ? routeHandler() : routeHandler;

    if (!page) return;

    
    const html = await page.render();
    this.#content.innerHTML = html;
    // Sembunyikan elemen pada halaman login/register
    if (url === '/login' || url === '/register') {
    document.querySelector('.input-group')?.classList.add('d-none'); // sembunyikan pencarian
    document.getElementById('filter-drawer')?.classList.add('d-none'); // sembunyikan filter
    
    } else {
    document.querySelector('.input-group')?.classList.remove('d-none');
    document.getElementById('filter-drawer')?.classList.remove('d-none');
    
    }

    new SlimSelect({ select: '#select-mood' });
    new SlimSelect({ select: '#select-genre' });

    this.#setupNavigationList();

    // Tunggu sampai DOM sudah terisi sebelum afterRender()
    await page.afterRender();
    }



        _setupDrawer(){
            this.#drawerButton.addEventListener('click', () => {
                this.#navigationDrawer.classList.toggle('open');
            });

            document.addEventListener('click', (event) => {
                if(! this.#drawerButton.contains(event.target) && !this.#navigationDrawer.contains(event.target)){
                    this.#navigationDrawer.classList.remove('open');
                }
            })

        }
        #setupNavigationList() {
    const navList = document.getElementById('navlist');
   

    // Bersihkan isi navList terlebih dahulu
    navList.innerHTML = '';
     const url = getActiveRoute();
  const isLoginOrRegister = url === '/login' || url === '/register';

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
  const logoutItem = document.createElement('li');
  logoutItem.innerHTML = `
    <a id="logout-button" class="logout-button" href="#/logout">
        <i class="fas fa-sign-out-alt"></i> Logout
    </a>
  `;
  navList.appendChild(logoutItem);

    // Event untuk tombol logout
  const logoutButton = logoutItem.querySelector('#logout-button');
  logoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (!getAccessToken()) {
      alert('Anda belum login.');
      location.hash = '/login';
      return;
    }
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      getLogout();
      location.hash = '/login';
    }
  });
}


 }