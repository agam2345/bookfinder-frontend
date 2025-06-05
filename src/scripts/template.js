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
  thumbnail
}) {
  return `
    <div tabindex="0" class="book-card book-item" data-bookid="${id}">
     <img src="${thumbnail}" alt="${title}" class="book-item__thumbnail">
      <div class="book-item__body">
        <div class="book-item__main">
          <h2 class="book-item__title">${title}</h2>
          <div class="book-item__rating">
            <i class="fas fa-star"></i> ${average_rating ?? 'N/A'}
          </div>
        </div>
        <div class="book-item__description">
          ${description_cleaned}
        </div>
        <a class="btn book-item__read-more" href="#/books/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
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


export function indikatorLoading(){
  return `
  <div class="loading-overlay" id="loading-overlay">
    <div class="spinner"></div>
  </div>
`
}
