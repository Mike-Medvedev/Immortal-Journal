// import { v4 as uuid4 } from "uuid";
import { uniqueNamesGenerator, Config, names } from "unique-names-generator";
const config: Config = {
  dictionaries: [names],
};

class WebSocketManager {
  private static _instance: WebSocketManager | null = null;
  public socket: WebSocket;
  public clientId: string = uniqueNamesGenerator(config);
  private constructor() {
    const characterName: string = uniqueNamesGenerator(config);
    this.socket = new WebSocket(
      `wss://immortal-journal-server.azurewebsites.net/ws/${characterName}`
    );
  }
  public static getInstance(): WebSocketManager {
    if (!WebSocketManager._instance) {
      WebSocketManager._instance = new WebSocketManager();
    }
    return WebSocketManager._instance;
  }
}

export default WebSocketManager;
