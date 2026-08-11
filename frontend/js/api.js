/* =========================================================================
   TRISHUL CRM — API Client
   Thin wrapper around the Fetch API for talking to the Spring Boot backend.
   Uses session cookies (credentials: 'include') for authentication.
   ========================================================================= */

const API_BASE_URL = "https://trishul-crm-backend.onrender.com";

const Api = {
  async request(path, { method = "GET", body = null, headers = {} } = {}) {
    const options = {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    if (body !== null) options.body = JSON.stringify(body);

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

    if (response.status === 401) {
      throw new ApiError(
        payload?.message || "Session expired. Please log in again.",
        401,
        payload,
      );
    }
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

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/* =========================================================================
   Session helpers
   ========================================================================= */
const Session = {
  KEY: "trishul_user",

  save(user) {
    sessionStorage.setItem(this.KEY, JSON.stringify(user));
  },

  get() {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  },

  clear() {
    sessionStorage.removeItem(this.KEY);
  },

  /** Verifies the session is valid server-side and refreshes local cache. */
  async requireAuth() {
    try {
      const res = await Api.get("/me");
      this.save(res.data);
      return res.data;
    } catch (err) {
      this.clear();
      window.location.href = "login.html";
      return null;
    }
  },

  hasRole(...roles) {
    const user = this.get();
    return user && roles.includes(user.role);
  },
};

/* =========================================================================
   Toast notifications
   ========================================================================= */
const Toast = {
  stack() {
    let el = document.querySelector(".toast-stack");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast-stack";
      document.body.appendChild(el);
    }
    return el;
  },
  show(message, type = "info") {
    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info",
    };
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
    this.stack().appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(30px)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },
  success(msg) {
    this.show(msg, "success");
  },
  error(msg) {
    this.show(msg, "error");
  },
  info(msg) {
    this.show(msg, "info");
  },
};

/* =========================================================================
   Small formatting helpers shared by every page
   ========================================================================= */
const Fmt = {
  currency(value) {
    const num = Number(value || 0);
    return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  },
  date(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },
  dateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d)) return value;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  initials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  },
  timeAgo(value) {
    if (!value) return "—";
    const diffMs = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  },
  escape(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  },
};

/* =========================================================================
   Shared phone input restriction — used by Customers, Leads, Employees forms
   Strips anything that isn't a digit and caps the length at 10 digits
   (Indian mobile number format) as the user types or pastes.
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

/* =========================================================================
   Shared name input restriction — used by Customer/Lead/Employee "name"
   fields. Allows letters, spaces, apostrophes, hyphens, and dots (for
   initials like "A. K. Sharma") — blocks digits and other symbols as the
   user types or pastes, so garbage like "6644464" can never be saved.
   ========================================================================= */
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
