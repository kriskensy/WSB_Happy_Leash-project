import { Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>1111</Text>
      <Link href={"/(auth)"}>Zaloguj sie</Link>
      <Link href={"/(auth)/register"}>Zarejestruj sie</Link>
    </View>
  );
}
