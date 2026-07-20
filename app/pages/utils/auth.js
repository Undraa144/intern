const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088";

export async function refreshAccessToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  const response = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });

  if (!response.ok) {
    localStorage.removeItem("token");
    throw new Error("Unable to refresh token");
  }

  const text = await response.text();

  if (!text) {
    throw new Error("Empty response");
  }

  const data = JSON.parse(text);

  if (!data.token) {
    throw new Error("New token not found");
  }

  localStorage.setItem("token", data.token);

  return data.token;
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("token");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    token = await refreshAccessToken();

    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return response;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}