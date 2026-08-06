/* =========================================================================
   TRISHUL CRM — API Client
   Thin wrapper around the Fetch API for talking to the Spring Boot backend.
   Uses session cookies (credentials: 'include') for authentication.
   ========================================================================= */

// Backend URL
const API_BASE_URL = "https://trishul-crm-backend.onrender.com";

const Api = {
  // Generic API request
  async request(path, { method = "GET", body = null, headers = {} } = {}) {
    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Convert object body to JSON
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    let response;

    try {
      response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch (networkError) {
      throw new ApiError(
        "Cannot reach the Trishul CRM server. Please make sure the backend is running.",
        0,
        null,
      );
    }

    let payload = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await response.json().catch(() => null);
    }

    // Redirect to login if session expired
    if (response.status === 401) {
      if (
        !window.location.pathname.endsWith("login.html") &&
        !window.location.pathname.endsWith("index.html") &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "login.html";
      }

      throw new ApiError(
        payload?.message || "Session expired. Please log in again.",
        401,
        payload,
      );
    }

    // Handle other API errors
    if (!response.ok) {
      throw new ApiError(
        payload?.message || `Request failed (${response.status})`,
        response.status,
        payload,
      );
    }

    return payload;
  },

  get(path) {
    return this.request(path, { method: "GET" });
  },

  post(path, body) {
    return this.request(path, { method: "POST", body });
  },

  put(path, body) {
    return this.request(path, { method: "PUT", body });
  },

  del(path) {
    return this.request(path, { method: "DELETE" });
  },
};

// Custom Error class
class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/* =========================================================================
   Shared phone input restriction
   ========================================================================= */
function wirePhoneInput(input) {
  if (!input || input.dataset.phoneWired) return;

  input.dataset.phoneWired = "1";
  input.setAttribute("maxlength", "10");
  input.setAttribute("inputmode", "numeric");
  input.setAttribute("pattern", "[0-9]{10}");

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
  });
}

function wireNameInput(input) {
  if (!input || input.dataset.nameWired) return;

  input.dataset.nameWired = "1";
  input.setAttribute("pattern", "[A-Za-z][A-Za-z .'-]*");
  input.setAttribute(
    "title",
    "Only letters, spaces, apostrophes, hyphens and dots are allowed",
  );

  input.addEventListener("input", () => {
    input.value = input.value
      .replace(/[^A-Za-z .'-]/g, "")
      .replace(/^[^A-Za-z]+/, "");
  });
}
