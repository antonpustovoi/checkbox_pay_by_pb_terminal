import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar, Button, Surface, Text, TextInput } from "react-native-paper";
import { useLocalServer } from "./useLocalServer";

export function App() {
  useLocalServer();

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
  }, []);

  const updateValues = (field: string, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    AsyncStorage.setItem("data", JSON.stringify(nextValues));
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <Appbar.Header>
        <Appbar.Content
          title="Checkbox - Оплата через Термінал"
          style={{ alignItems: "center" }}
        />
      </Appbar.Header>
      <Surface style={{ flexGrow: 1, padding: 12 }} elevation={4}>
        <View style={{ flexGrow: 1, justifyContent: "center", gap: 8 }}>
          <TextInput
            mode="outlined"
            label="Токен Інтеграції"
            value={values.token}
            disabled={isRunning}
            onChangeText={(value) => updateValues("token", value)}
          />
          <TextInput
            mode="outlined"
            label="CLID"
            value={values.clid}
            disabled={isRunning}
            onChangeText={(value) => updateValues("clid", value)}
          />
          <TextInput
            mode="outlined"
            label="Secret"
            value={values.secret}
            disabled={isRunning}
            onChangeText={(value) => updateValues("secret", value)}
          />
        </View>
        <Button
          mode="contained"
          onPress={() => setIsRunning((isRunning) => !isRunning)}
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
    </View>
  );
}
