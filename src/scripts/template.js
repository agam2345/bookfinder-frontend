export function generateFilterFormTemplate(){
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
                    <option value="">Senang</option>
                    <option value="">Susah</option>
                    <option value="">Sedih</option>
                    </select>
                </section>
                <section>
                    <p>Genre buku apa yang Anda ingin baca?</p>
                    <select id="select-genre">
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
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
