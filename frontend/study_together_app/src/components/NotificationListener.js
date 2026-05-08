import { useEffect } from "react";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function NotificationListener() {

  useEffect(() => {

    // 🔔 Notification Permission
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 🚀 STOMP CLIENT
    const client = new Client({

      brokerURL: undefined,

      webSocketFactory: () =>
        new SockJS("http://localhost:8080/ws"),

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,

      heartbeatOutgoing: 4000,

      debug: (str) => {
        console.log("STOMP:", str);
      },

      onConnect: () => {

        console.log(
          "✅ WebSocket Connected"
        );

        // 📩 SUBSCRIBE
        client.subscribe(
          "/topic/notifications",

          (message) => {

            console.log(
              "📩 RECEIVED:",
              message.body
            );

            // 🔥 TEST ALERT
           toast.info(message.body, {

  position: "top-right",

  autoClose: 5000
});

            // 🔔 Browser Notification
            if (
              Notification.permission === "granted"
            ) {

              new Notification(
                "📚 Planner Alert",
                {
                  body: message.body
                }
              );
            }
          }
        );

        console.log(
          "✅ SUBSCRIBED SUCCESSFULLY"
        );
      },

      onStompError: (frame) => {

        console.error(
          "❌ STOMP ERROR:",
          frame
        );
      },

      onWebSocketError: (error) => {

        console.error(
          "❌ SOCKET ERROR:",
          error
        );
      }
    });

    // ACTIVATE
    client.activate();

    // CLEANUP
    return () => {
      client.deactivate();
    };

  }, []);

  return null;
}

export default NotificationListener;