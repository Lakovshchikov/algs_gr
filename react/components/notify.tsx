import { useCallback, useEffect, useState } from "react";

type Message = {
  type: "error" | "success";
  msg: string;
};

export const NotifyComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  useEffect(() => {
    const listener = (e: CustomEvent<Message>) => {
      setMessages((prev) => [...prev, e.detail]);
    };

    addEventListener("notify:message", listener);

    return () => {
      removeEventListener("notify:message", listener);
    };
  }, []);

  const showNext = useCallback(() => {
    const next = messages[0];
    if (!next) return;

    setCurrentMessage(next);
    setMessages((prev) => prev.slice(1));

    setTimeout(() => {
      setCurrentMessage(null);
      showNext();
    }, 2000);
  }, [messages]);

  useEffect(() => {
    if (!currentMessage && messages.length > 0) {
      showNext();
    }
  }, [messages, currentMessage, showNext]);

  return (
    <div>
      {currentMessage ? (
        <div
          style={{ color: currentMessage.type === "error" ? "red" : "green" }}
        >
          {currentMessage.msg}
        </div>
      ) : (
        <div>no messages</div>
      )}

      <div>
        <button onClick={() => notify.error(Date.now.toString())}>error</button>
        <button onClick={() => notify.success(Date.now.toString())}>
          success
        </button>
      </div>
    </div>
  );
};

class Notify {
  constructor() {}

  success(msg: string) {
    const event = new CustomEvent<Message>("notify:message", {
      detail: { msg, type: "success" },
    });
    dispatchEvent(event);
  }

  error(msg: string) {
    const event = new CustomEvent<Message>("notify:message", {
      detail: { msg, type: "error" },
    });
    dispatchEvent(event);
  }
}

export const notify = new Notify();
