import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useForegroundService() {
  const start = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) return;
    notifee.onForegroundEvent(({ type, detail }) => {
      console.log("bbbbbbbbbbb", type, detail);
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === "stop") {
        // await notifee.stopForegroundService()
      }
    });
    notifee.registerForegroundService((notification) => {
      return new Promise(() => {
        notifee.onForegroundEvent(({ type, detail }) => {
          console.log("AAAAAAaaa", type, detail);
          if (
            type === EventType.ACTION_PRESS &&
            detail.pressAction.id === "stop"
          ) {
            // await notifee.stopForegroundService()
          }
        });
      });
    });
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("++++++++++++", type, detail);
    });
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: "Checkbox - Оплата через Термінал",
      body: "Сервіс запущено",
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
      },
    });
    await AsyncStorage.setItem("isServiceRunning", "true");
  };

  const stop = async () => {
    await notifee.stopForegroundService();
    await AsyncStorage.removeItem("isServiceRunning");
  };

  return { start, stop };
}
