const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8001";

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_URL + path, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    let msg = "Request failed";
    if (data && typeof data.detail === "string") msg = data.detail;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: function (body) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  login: async function (email, password) {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    return request("/api/auth/login/form", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    });
  },
  createPrediction: function (body) {
    return request("/api/predictions", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  getPredictions: function () {
    return request("/api/predictions");
  },
};
