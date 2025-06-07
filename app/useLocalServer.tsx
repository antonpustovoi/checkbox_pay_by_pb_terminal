import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import * as Device from "expo-device";
import * as server from "expo-http-server";
import * as IntentLauncher from "expo-intent-launcher";
import { useEffect } from "react";
import { sha1 } from "react-native-sha256";

const callPrivatBankApi = async (path: string, payload: object) => {
  const data = await AsyncStorage.getItem("data");
  const { clid, secret } = JSON.parse(data ?? "");
  const signed = Math.trunc(Date.now() / 1000);
  const signature = await sha1(
    `${signed}${secret}${JSON.stringify(payload)}${secret}`
  );
  const response = await fetch(
    `https://dio.privatbank.ua/api/nfcpos/integrators${path}.php?clid=${clid}&signed=${signed}&signature=${signature}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.json();
};

export function useLocalServer(port: number) {
  useEffect(() => {
    server.setup(port);

    server.route("/api/devices", "GET", async () => {
      const name = `${Device.deviceName} (Manufacturer: ${Device.manufacturer}, Model: ${Device.modelName})`;
      return {
        statusCode: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: randomUUID(),
          name: name,
        }),
      };
    });

    server.route("/api/call", "GET", async (request) => {
      const data = await AsyncStorage.getItem("data");
      const { token } = JSON.parse(data ?? "");
      const { amount } = request.body
        ? JSON.parse(request.body)
        : { amount: 100 };
      const tokenData = await callPrivatBankApi("/token", {
        operation: "pay",
        amount: amount / 100,
        purpose: "Оплата за товари та послуги",
        client_token: token,
      });
      const url = new URL("nfcterminal://executor");
      url.search = new URLSearchParams({ token: tokenData.jwt }).toString();
      const a = await IntentLauncher.startActivityAsync(
        "android.intent.action.VIEW",
        { data: url.toString() }
      );
      const checkData = await callPrivatBankApi("/check", {
        jwt: tokenData.jwt,
      });
      console.log("+++++++++++", checkData);
      const result = checkData.pay;
      const data3 = {
        success: true,
        result: {
          bank_name: "Приватбанк",
          card_mask: result["masked_pan"],
          payment_system: result["payment_system"],
          auth_code: result["approval_code"],
          rrn: result["rrn"],
          merchant_id: result["merchant"],
          date_time: result["date"],
        },
      };
      console.log("AAAAAAAAAA", data3, a, checkData);
      return { statusCode: 200 };
    });

    server.start();

    return () => server.stop();
  }, [port]);
}
