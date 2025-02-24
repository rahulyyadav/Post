import { useEffect } from "react";
import { webSocketService } from "@/services/websocket";

export default function ChatContainer() {
  useEffect(() => {
    // Connect to WebSocket when component mounts
    webSocketService.connect();

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    webSocketService.sendMessage({
      action: "sendMessage",
      message,
      sender: "user1@example.com", // Replace with actual user email
      receiver: "user2@example.com", // Replace with actual recipient
    });
  };

  // Rest of your chat component code
}
