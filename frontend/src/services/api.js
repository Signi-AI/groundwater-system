const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8001";

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
  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  if (options.body && !(options.body instanceof URLSearchParams)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_URL + path, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    let msg = "Request failed";
    if (data && typeof data.detail === "string") {
      msg = data.detail;
    } else if (data && Array.isArray(data.detail)) {
      msg = data.detail
        .map(function (d) {
          return d.msg || JSON.stringify(d);
        })
        .join(", ");
    }
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
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

  sendOtp: function (email) {
    return request("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });
  },

  verifyOtp: function (email, otp) {
    return request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: email, otp: otp }),
    });
  },

  resetPassword: function (email, otp, new_password) {
    return request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        otp: otp,
        new_password: new_password,
      }),
    });
  },

  changePassword: function (current_password, new_password) {
    return request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: current_password,
        new_password: new_password,
      }),
    });
  },

  // Profile
  getProfile: function () {
    return request("/api/users/me/profile");
  },

  // Predictions
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