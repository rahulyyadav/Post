"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { webSocketService } from "@/services/websocket";
import { AuthService } from "@/services/auth";

interface WebSocketLoginResponse {
  action: string;
  data: {
    message?: string;
    error?: string;
    errorType?: "USER_NOT_FOUND" | "OTHER";
    user?: {
      email: string;
      connectionId: string;
      firstName: string;
      lastName: string;
      gender: string;
      dateOfBirth: string;
      profilePictureUrl: string | null;
      useInitials: boolean;
      createdAt: string;
      updatedAt: string;
    };
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await webSocketService.login(email);
      console.log("Login Response:", response);

      if (response?.user && response?.tokens) {
        // Store tokens and user data
        AuthService.setTokens(response.tokens);
        AuthService.setUser(response.user);

        // Force navigation
        window.location.replace("/");
        return;
      } else {
        console.error("Invalid response structure:", response);
        setError("Invalid login response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Sign In</h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B45E0]"
              aria-label="Email Address"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5B45E0] text-white py-2 rounded-lg hover:bg-[#4c39b5] transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-[#5B45E0] hover:underline font-medium"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
