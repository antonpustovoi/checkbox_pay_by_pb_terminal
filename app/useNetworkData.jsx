import { getIpAddressAsync } from "expo-network";
import { useEffect, useState } from "react";

export function useNetworkData() {
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    getIpAddressAsync().then(setIpAddress);
  }, []);

  return { ipAddress };
}
