import { randomUUID } from "expo-crypto";
import * as Device from "expo-device";
import * as server from "expo-http-server";
import { useEffect } from "react";

export function useLocalServer(port: number) {
  useEffect(() => {
    server.setup(port, (event: any) => {
      if (event.status === "ERROR") {
        // there was an error...
      } else {
        // server was STARTED, PAUSED, RESUMED or STOPPED
      }
    });
    server.route("/api/devices", "GET", async () => {
      const name = `${Device.deviceName} (Manufacturer: ${Device.manufacturer}, Model: ${Device.modelName})`;
      console.log("XXXXXXXX", name);
      return {
        statusCode: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: randomUUID(),
          name: name,
        }),
      };
    });
    server.start();
    return () => {
      server.stop();
    };
  }, []);
}
