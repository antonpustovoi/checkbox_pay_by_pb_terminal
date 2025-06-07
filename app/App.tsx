import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Appbar, Button, Surface, Text, TextInput } from "react-native-paper";
import { useForegroundService } from "./useForegroundService";
import { useLocalServer } from "./useLocalServer";
import { useNetworkData } from "./useNetworkData";

const PORT = 9666;

export function App() {
  useLocalServer(PORT);

  const foregroundService = useForegroundService();

  const { ipAddress } = useNetworkData();

  const [values, setValues] = useState({
    token: "",
    clid: "",
    secret: "",
  });

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("data").then((data) => {
      if (data) setValues(JSON.parse(data));
    });
    AsyncStorage.getItem("isServiceRunning").then((data) => {
      setIsRunning(Boolean(data));
    });
  }, []);

  const updateValues = (field: string, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    AsyncStorage.setItem("data", JSON.stringify(nextValues));
  };

  const handlePress = () =>
    setIsRunning((isRunning) => {
      if (isRunning) foregroundService.stop();
      else foregroundService.start();
      return !isRunning;
    });

  const renderInput = (label: string, field: "token" | "clid" | "secret") => (
    <TextInput
      mode="outlined"
      label={label}
      value={values[field]}
      disabled={isRunning}
      onChangeText={(value) => updateValues(field, value)}
    />
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title="Checkbox - Оплата через Термінал"
          style={{ alignItems: "center" }}
        />
      </Appbar.Header>
      <Surface
        style={{ flex: 1, padding: 12, justifyContent: "space-between" }}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", paddingBlockStart: 24 }}
          >
            IP адреса: {ipAddress}:{PORT}
          </Text>
        </View>
        <View style={{ justifyContent: "center", gap: 8 }}>
          {renderInput("Токен Інтеграції", "token")}
          {renderInput("CLID", "clid")}
          {renderInput("Secret", "secret")}
        </View>
        <Button
          mode="contained"
          onPress={handlePress}
          style={{
            borderRadius: 12,
            justifyContent: "center",
            backgroundColor: isRunning ? "#707070" : "#62d545",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              height: 32,
              fontWeight: "bold",
              verticalAlign: "middle",
              color: "#FFF",
            }}
          >
            {isRunning ? "Зупинити сервер" : "Запустити сервер"}
          </Text>
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}
