import notifee, { AuthorizationStatus } from "@notifee/react-native";

export function useForegroundService() {
  const start = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) return;
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    notifee.displayNotification({
      title: "Foreground Service Notification",
      body: "Press the Quick Action to stop the service",
      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
      },
    });
  };

  const stop = async () => {
    await notifee.stopForegroundService();
  };

  return { start, stop };
}
