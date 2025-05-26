import * as server from "expo-http-server";
import { useEffect } from "react";

export function useLocalServer() {
  const obj = { app: "expo-http-server", desc: "You can load JSON!" };
  console.log("XXXXXXXX", server);
  useEffect(() => {
    server.setup(9666, (event: any) => {
      if (event.status === "ERROR") {
        // there was an error...
      } else {
        // server was STARTED, PAUSED, RESUMED or STOPPED
      }
    });
    // server.route("/", "GET", async (request) => {
    //   console.log("Request", "/", "GET", request);
    //   return {
    //     statusCode: 200,
    //     headers: {
    //       "Custom-Header": "Bazinga",
    //     },
    //     contentType: "application/json",
    //     body: JSON.stringify(obj),
    //   };
    // });
    // server.start();
    // return () => {
    //   server.stop();
    // };
  }, []);
}
