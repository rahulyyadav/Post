import Cookies from "js-cookie";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  dateOfBirth: string;
}

export class AuthService {
  private static ACCESS_TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";
  private static USER_KEY = "user";

  static setTokens(tokens: Tokens) {
    // Store both tokens in cookies
    Cookies.set(this.ACCESS_TOKEN_KEY, tokens.accessToken, { expires: 1 }); // 1 day
    Cookies.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken, { expires: 7 }); // 7 days
  }

  static setUser(user: User) {
    Cookies.set(this.USER_KEY, JSON.stringify(user), { expires: 7 });
  }

  static getUser(): User | null {
    const userData = Cookies.get(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static getAccessToken(): string | null {
    return Cookies.get(this.ACCESS_TOKEN_KEY) || null;
  }

  static logout() {
    Cookies.remove(this.ACCESS_TOKEN_KEY);
    Cookies.remove(this.REFRESH_TOKEN_KEY);
    Cookies.remove(this.USER_KEY);
    window.location.href = "/login";
  }

  static async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Important for cookies
      });

      if (!response.ok) throw new Error("Refresh failed");

      const { accessToken } = await response.json();
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      return accessToken;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}
