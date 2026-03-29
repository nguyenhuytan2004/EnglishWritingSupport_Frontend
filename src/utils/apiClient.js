import { API_BASE_URL } from "../constants/api";

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
    };

    try {
      const response = await fetch(url, config);
      let contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorMessage;
        errorMessage = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        throw errorMessage || `HTTP error! ${response.status}`;
      }

      return contentType?.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch (error) {
      console.error("Error occurred:", error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

export default new ApiClient();
