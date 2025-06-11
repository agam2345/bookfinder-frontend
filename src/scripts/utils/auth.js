import { getActiveRoute } from "../routes/url-parser";
import { ACCESS_TOKEN_KEY } from "../config";
import { jwtDecode } from "jwt-decode";

const USER_ID_KEY = "userId";
const USERNAME_KEY = "username";

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!accessToken || accessToken === "null" || accessToken === "undefined") {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error("getAccessToken: error:", error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);

    // MENDEKODE TOKEN DAN MENYIMPAN USER ID/USERNAME
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const username = decodedToken.username;

      if (userId) {
        localStorage.setItem(USER_ID_KEY, userId);
        console.log("User ID disimpan di localStorage:", userId);
      }
      if (username) {
        localStorage.setItem(USERNAME_KEY, username);
        console.log("Username disimpan di localStorage:", username);
      }
    } catch (decodeError) {
      console.error(
        "Failed to decode JWT token or extract user data:",
        decodeError
      );

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(USERNAME_KEY);

      alert("Token autentikasi tidak valid. Silakan login kembali.");
      location.hash = "#/login";
      return false;
    }

    return true;
  } catch (error) {
    console.error("putAccessToken: error:", error);
    return false;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
    return true;
  } catch (error) {
    console.error("getLogout: error:", error);
    return false;
  }
}

export function getUserId() {
  try {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId || userId === "null" || userId === "undefined") {
      return null;
    }
    return userId;
  } catch (error) {
    console.error("getUserId: error:", error);
    return null;
  }
}

export function getUsername() {
  try {
    const username = localStorage.getItem(USERNAME_KEY);
    if (!username || username === "null" || username === "undefined") {
      return null;
    }
    return username;
  } catch (error) {
    console.error("getUsername: error:", error);
    return null;
  }
}

const unauthenticatedRoutesOnly = ["/login", "/register"];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = "/";
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = "/login";
    return null;
  }

  return page;
}

export function getLogout() {
  removeAccessToken();
}
