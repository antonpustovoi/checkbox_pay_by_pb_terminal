import { useState } from "react";
import { Text, View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";

export default function Index() {
  const [values, setValues] = useState({
    token: "",
    clid: "",
    secret: "",
  });

  const [isRunning, setIsRunning] = useState(false);

  return (
    <View
      style={{
        padding: 12,
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#000",
        // alignItems: "center",
      }}
    >
      <Appbar>11111111</Appbar>
      <Text>Edit app/index.tsx to edit this screen1111.</Text>
        <TextInput
          mode="outlined"
          label="Токен Інтеграції"
          value={values.token}
          onChangeText={value => setValues(values => ({ ...values, token: value }))}
        />
       <TextInput
          mode="outlined"
          label="CLID"
          value={values.clid}
          onChangeText={value => setValues(values => ({ ...values, clid: value }))}
        />
        <TextInput
          mode="outlined"
          label="Secret"
          value={values.secret}
          onChangeText={value => setValues(values => ({ ...values, secret: value }))}
        />
        <Button mode="contained" onPress={() => setIsRunning(isRunning => !isRunning)}>{isRunning ? "Запустити сервер" : "Зупинити сервер"}</Button>
    </View>
  );
}
