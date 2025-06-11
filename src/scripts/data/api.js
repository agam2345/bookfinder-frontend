import { getAccessToken } from "../utils/auth";
import { BASE_URL } from "../config";

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  //item
  BOOKS: `${BASE_URL}/books`,

  FINISHED_BOOKS: `${BASE_URL}/finished-books`,
};
export async function getRegistered({ username, email, password }) {
  const data = JSON.stringify({ username, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
export async function getAllBooks() {
  const accessToken = getAccessToken();

  const response = await fetch(ENDPOINTS.BOOKS, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();

  return {
    data: json.data,
    ok: response.ok,
  };
}

export async function getDetailBook(id) {
  const accessToken = getAccessToken();
  const response = await fetch(`${ENDPOINTS.BOOKS}/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  return json.data;
}

export async function getBooksByMoodOrGenre({ mood, genre }) {
  const accessToken = getAccessToken();
  let url = `${ENDPOINTS.BOOKS}?`;

  if (genre) {
    url += `genre=${genre}&`;
  }
  if (mood) {
    url += `mood=${mood}&`;
  }

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();

  return {
    data: json.data,
    ok: response.ok,
  };
}

export async function getBooksByQueryUser(query) {
  const accessToken = getAccessToken();
  const response = await fetch(`${ENDPOINTS.BOOKS}/filter`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: query,
  });

  const json = await response.json();

  return {
    data: json.data,
    ok: response.ok,
  };
}

export async function addFinishedBook(bookData) {
  const accessToken = getAccessToken();

  const data = JSON.stringify(bookData);

  const fetchResponse = await fetch(ENDPOINTS.FINISHED_BOOKS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getFinishedBooks() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.FINISHED_BOOKS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
