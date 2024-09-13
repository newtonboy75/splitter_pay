import { useState, useEffect } from "react";
import useWebSocket from "./useWebSocket";
import he from "he";

export const useWebSocketHandler = (url: any, current_user: any) => {
  const { lastMessage, readyState } = useWebSocket(url);
  const [triggerRefresh, setTriggerRefresh] = useState(0);
  const [toastInfo, setToastInfo] = useState("");
  const [openToast, setOpenToast] = useState(false);

  useEffect(() => {
    if (lastMessage && typeof lastMessage === "string") {
      if (lastMessage !== "ok bye") {
        try {
          const data = JSON.parse(lastMessage);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      }
    }
  }, [lastMessage, readyState]);

  const handleWebSocketMessage = (data: any) => {
    if (data.disposition === "split_invite") {
      //Split invite, user initiated a split
      const initiator = data.data.splitters.filter(
        (splitter: { is_initiator: boolean }) => splitter.is_initiator === true
      );

      if (initiator[0]["email"] === current_user.email) {
        setToastInfo(
          `You have set up a split for ${he.decode(data.data.name)} for ${
            initiator[0]["share_amount"]
          }`
        );
      } else {
        data.data.splitters.map(
          (invitee: { email: string; is_initiator: boolean }) => {
            if (invitee.email === current_user.email) {
              setToastInfo(
                `${
                  initiator[0]["name"]
                } would like to split the cost for ${he.decode(
                  data.data.name
                )} for $${initiator[0]["share_amount"]}`
              );
            }
          }
        );
      }

      setOpenToast(true);
    } else if (data.disposition === "payment_successful") {
      //User made payment
      if (data.data.initiator_id === current_user.id) {
        setToastInfo(
          `Payment of $${data.data.share_amount} was received from ${
            data.data.payee
          } for ${he.decode(data.data.name)}.`
        );
        setOpenToast(true);
      }
    } else if (data.disposition === "payment_cancelled") {
      //console.log(data)
      const initiator = data.data.splitters.splitters.filter(
        (splitter: { is_initiator: boolean }) => splitter.is_initiator === true
      );

      data.data.splitters.splitters.map(
        (splitter: { email: string; is_initiator: boolean }) => {
          if (splitter.email === current_user.email && !splitter.is_initiator) {
            setToastInfo(
              `${initiator[0]["name"]} cancelled ${data.data.splitters.name} and doesn't want to split the bill anymore.`
            );
            setOpenToast(true);
          }
        }
      );
    } else if (data.disposition === "split_complete") { //Split has been completed
      if (data.data.initiator_id === current_user.id) {
        setToastInfo(
          `Split for ${he.decode(data.data.name)} has been completed.`
        );
        setOpenToast(true);
      }
    }

    setTriggerRefresh((prev) => prev + 1);
  };

  return { triggerRefresh, toastInfo, openToast, setOpenToast };
};
