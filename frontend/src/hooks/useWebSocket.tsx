import { useEffect, useRef, useState } from "react";
import { WebSocketHook } from "../utils/types/interface";

const useWebSocket = (
  url: string,
  pingInterval: number = 30000
): WebSocketHook => {
  const [lastMessage, setLastMessage] = useState<string | any | null>(null);
  const [readyState] = useState<number>(WebSocket.CONNECTING);
  const webSocketRef = useRef<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {

      setRetryCount(0); //reset connection if unssuccessful

      // Send ping every 30 secs
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);

      (socket as any).pingInterval = pingInterval;
    };

    socket.onmessage = (event) => {
        setLastMessage(event.data);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      clearInterval((socket as any).pingInterval);

      if (retryCount < 5) {
        // Limit the number of reconnection attempts
        const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
        console.log(`Reconnecting in ${timeout / 1000} seconds...`);
        setTimeout(useWebSocket, timeout);
        setRetryCount(retryCount + 1);
      } else {
        console.error("Max reconnection attempts reached. Giving up.");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close(); // Close the socket and trigger the onclose event
    };
  }, [url, pingInterval]);

  const sendMessage = (message: string) => {
    if (
      webSocketRef.current &&
      webSocketRef.current.readyState === WebSocket.OPEN
    ) {
      webSocketRef.current.send(message);
    } else {
      console.warn("WebSocket is not open. Message not sent.");
    }
  };

  return {
    sendMessage,
    lastMessage,
    readyState,
  };
};

export default useWebSocket;
