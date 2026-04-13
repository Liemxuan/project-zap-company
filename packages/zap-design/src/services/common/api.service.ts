/**
 * Common API Service (Standalone)
 * Handles basic HTTP communication, headers (Auth, Lang), and error management.
 */

export interface RequestOptions {
  token?: string;
  lang?: string;
}

export const apiService = {
  /**
   * Generic POST request handler
   */
  async post<T>(url: string, body: any, options: RequestOptions = {}): Promise<T> {
    const { token, lang = 'en' } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept-Language': lang === 'en' ? "1" : "2",
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`[API_SERVICE] POST ${url} failed:`, error);
      throw error;
    }
  },

  /**
   * Generic GET request handler
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { token, lang = 'en' } = options;

    const headers: Record<string, string> = {
      'Accept-Language': lang === 'en' ? "1" : "2",
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`[API_SERVICE] GET ${url} failed:`, error);
      throw error;
    }
  }
};
