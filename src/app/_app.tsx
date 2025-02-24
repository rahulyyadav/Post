"use client";

import { useEffect } from "react";
import { webSocketService } from "@/services/websocket";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Establish WebSocket connection when app loads
    webSocketService.connect().catch(console.error);

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return <>{children}</>;
}
