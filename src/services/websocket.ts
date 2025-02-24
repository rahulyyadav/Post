import { websocketConfig, getWebSocketUrl } from "@/lib/websocket-config";
import { loginUser } from "@/utils/api";

interface WebSocketResponse {
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

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = getWebSocketUrl().replace(/\/$/, "");
        console.log("Attempting WebSocket connection to:", wsUrl);

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
          console.log("WebSocket connected successfully");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          console.log("WebSocket message received:", event.data);
          try {
            const data = JSON.parse(event.data);
            const handler = this.messageHandlers.get(data.action);
            if (handler) {
              handler(data);
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(new Error("WebSocket connection failed"));
        };

        this.socket.onclose = (event) => {
          console.log(
            "WebSocket closed with code:",
            event.code,
            "reason:",
            event.reason
          );
          this.socket = null;

          if (event.code === 1006) {
            console.error("Abnormal closure - check API Gateway configuration");
          }

          this.handleReconnect();
        };
      } catch (error) {
        console.error("WebSocket setup failed:", error);
        reject(error);
      }
    });
  }

  async login(email: string): Promise<WebSocketResponse["data"]> {
    try {
      await this.connect();

      const loginPayload = {
        action: "login",
        email: email,
      };

      return new Promise((resolve, reject) => {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          reject(new Error("WebSocket connection not available"));
          return;
        }

        this.socket.send(JSON.stringify(loginPayload));

        this.messageHandlers.set(
          "loginResponse",
          (response: WebSocketResponse) => {
            console.log("Raw login response:", response);
            if (response.data?.error) {
              reject(new Error(response.data.error));
            } else {
              resolve(response.data);
            }
          }
        );
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts})`);
        this.connect();
      }, 2000 * this.reconnectAttempts);
    }
  }

  sendChatMessage(recipientEmail: string, message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    this.socket.send(
      JSON.stringify({
        action: "sendMessage",
        data: {
          recipientEmail,
          message,
        },
      })
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const webSocketService = new WebSocketService();
