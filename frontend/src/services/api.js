const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export function getToken() {
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
  if (token) headers.Authorization = `Bearer ${token}`;

  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Backend haipatikani. Hakikisha API server ina-run, kisha refresh ukurasa."
    );
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("auth:expired"));
    }
    let msg = "Request failed";
    if (typeof data?.detail === "string") msg = data.detail;
    else if (Array.isArray(data?.detail)) {
      msg = data.detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: async (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    return request("/api/auth/login/form", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  },

  sendOtp: (email) =>
    request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email, otp) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),

  resetPassword: (email, otp, new_password) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, new_password }),
    }),

  createPrediction: (body) =>
    request("/api/predictions", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPredictions: () => request("/api/predictions"),
};