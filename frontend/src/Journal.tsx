import WebSocketManager from "./socket.ts";
import { useEffect, useState } from "react";
import styles from "./Journal.module.css";

type Cursor = { x: number; y: number };
interface User {
  cursor?: Cursor;
  text?: string;
  clientId: string;
}
const randColor = window.randomColor();
const Journal = () => {
  const ws_singleton = WebSocketManager.getInstance();
  const [value, setValue] = useState("");
  const [, setMyCursor] = useState<Cursor>({ x: -5, y: -5 });
  const [userData, setUserData] = useState<User[]>([
    { clientId: ws_singleton.clientId },
  ]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    setUserData((prev) =>
      prev.map((u) =>
        u.clientId === ws_singleton.clientId
          ? { ...u, text: e.target.value }
          : u
      )
    );
    ws_singleton.socket.send(
      JSON.stringify({ text: e.target.value, clientId: ws_singleton.clientId })
    );
  };

  useEffect(() => {
    const messageHandler = (event: any) => {
      console.log(event.data);
      const payload = JSON.parse(event.data);
      if (payload.cursor) {
        console.log("received mouse movement", payload.cursor);
        setUserData((prev) => {
          const userExists = prev.some((u) => u.clientId === payload.clientId);
          if (userExists) {
            return prev.map((u) =>
              u.clientId === payload.clientId
                ? { ...u, cursor: payload.cursor }
                : u
            );
          }
          return [
            ...prev,
            { clientId: payload.clientId, cursor: payload.cursor },
          ];
        });
      } else {
        console.log("Message from server ", payload.text);
        setValue(payload.text);
        setUserData((prev) => {
          const userExists = prev.some((u) => u.clientId === payload.clientId);
          if (userExists) {
            return prev.map((u) =>
              u.clientId === payload.clientId
                ? { ...u, text: u.text + payload.text }
                : u
            );
          } else {
            return [
              ...prev,
              { clientId: payload.clientId, cursor: payload.cursor },
            ];
          }
        });
      }
    };
    const captureMouseMove = (e: MouseEvent) => {
      setUserData((prev) =>
        prev.map((u) =>
          u.clientId === ws_singleton.clientId
            ? { ...u, cursor: { x: e.x, y: e.y } }
            : u
        )
      );
      setMyCursor({ x: e.x, y: e.y });
      ws_singleton.socket.send(
        JSON.stringify({
          cursor: { x: e.x, y: e.y },
          clientId: ws_singleton.clientId,
        })
      );
    };
    ws_singleton.socket.addEventListener("message", messageHandler);
    window.addEventListener("mousemove", captureMouseMove);

    return () => {
      ws_singleton.socket.removeEventListener("message", messageHandler);
      window.removeEventListener("mousemove", captureMouseMove);
    };
  }, []);

  return (
    <main>
      <label htmlFor="textarea"> Enter Journal</label>
      <textarea
        id="textarea"
        placeholder="Enter journal stuff"
        value={value}
        onChange={(e) => handleInput(e)}
      />
      {userData.map((u) =>
        u.clientId != ws_singleton.clientId ? (
          <div
            className={styles.cursor}
            style={{
              left: u.cursor?.x || 0,
              top: u.cursor?.y || 0,
              backgroundColor: randColor,
            }}
          >
            <p style={{ color: randColor }}>{u.clientId}</p>
          </div>
        ) : (
          ""
        )
      )}
    </main>
  );
};
export default Journal;
