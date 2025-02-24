export const websocketConfig = {
  // WebSocket endpoint from API Gateway
  WS_API_ENDPOINT: process.env.NEXT_PUBLIC_WS_API_ENDPOINT,
};

export const getWebSocketUrl = () => {
  const wsEndpoint = process.env.NEXT_PUBLIC_WS_API_ENDPOINT;

  if (!wsEndpoint) {
    throw new Error("WebSocket endpoint is missing");
  }

  return wsEndpoint;
};
