import * as Device from "expo-device";
import * as server from "expo-http-server";
import { useEffect } from "react";
export function useLocalServer() {
  const obj = { app: "expo-http-server", desc: "You can load JSON!" };
  console.log("XXXXXXXX", Device.deviceName);
  useEffect(() => {
    server.setup(9666, (event: any) => {
      if (event.status === "ERROR") {
        // there was an error...
      } else {
        // server was STARTED, PAUSED, RESUMED or STOPPED
      }
    });
    server.route("/api/devices", "GET", async (request) => {
      // var uuid = Uuid();
      // DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
      // AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      // var name =
      //     '${androidInfo.name} (Manufacturer: ${androidInfo.manufacturer}, Model: ${androidInfo.model})';
      // return {"id": uuid.v4(), "name": name};
      return {
        statusCode: 200,
        headers: {
          "Custom-Header": "Bazinga",
        },
        contentType: "application/json",
        body: JSON.stringify(obj),
      };
    });
    server.start();
    return () => {
      server.stop();
    };
  }, []);
}
