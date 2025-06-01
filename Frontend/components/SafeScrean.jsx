import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/colors";
import LogoutButton from "./LogoutButton";

export default function SafeScrean({ children }) {
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLoggedIn(!!token && token !== "");
    };
    checkToken();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {isLoggedIn && (
        <View style={styles.logoutButtonWrapper}>
          <LogoutButton />
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  logoutButtonWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
});
