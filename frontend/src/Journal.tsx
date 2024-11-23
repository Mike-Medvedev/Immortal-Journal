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
    const messageHandler = (event: MessageEvent) => {
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
      const cursor: Cursor = { x: e.clientX, y: e.clientY };
      updateCursor(cursor);
    };

    const captureTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const cursor: Cursor = { x: touch.clientX, y: touch.clientY };
        updateCursor(cursor);
      }
    };

    const updateCursor = (cursor: Cursor) => {
      setUserData((prev) =>
        prev.map((u) =>
          u.clientId === ws_singleton.clientId ? { ...u, cursor } : u
        )
      );
      setMyCursor(cursor);
      ws_singleton.socket.send(
        JSON.stringify({
          cursor,
          clientId: ws_singleton.clientId,
        })
      );
    };

    ws_singleton.socket.addEventListener("message", messageHandler);
    window.addEventListener("mousemove", captureMouseMove);
    window.addEventListener("touchmove", captureTouchMove);

    // Optional: Handle touch start and end if you want to track touch presence
    const captureTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const cursor: Cursor = { x: touch.clientX, y: touch.clientY };
        updateCursor(cursor);
      }
    };

    window.addEventListener("touchstart", captureTouchStart);

    return () => {
      ws_singleton.socket.removeEventListener("message", messageHandler);
      window.removeEventListener("mousemove", captureMouseMove);
      window.removeEventListener("touchmove", captureTouchMove);
      window.removeEventListener("touchstart", captureTouchStart);
    };
  }, [ws_singleton]);

  return (
    <main>
      <label htmlFor="textarea"> Enter Journal</label>
      <textarea
        id="textarea"
        placeholder="Enter journal stuff"
        value={value}
        onChange={handleInput}
      />
      {userData.map((u) =>
        u.clientId !== ws_singleton.clientId && u.cursor ? (
          <div
            key={u.clientId}
            className={styles.cursor}
            style={{
              left: u.cursor.x,
              top: u.cursor.y,
              backgroundColor: randColor,
            }}
          >
            <p style={{ color: randColor }}>{u.clientId}</p>
          </div>
        ) : null
      )}
    </main>
  );
};

export default Journal;
