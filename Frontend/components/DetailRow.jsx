import React from "react";
import { View, Text } from "react-native";
import adminStyles from "../assets/styles/admin.styles";

export default function DetailRow({ label, value, valueStyle }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <Text style={[adminStyles.detailLabel, { minWidth: 110 }]}>{label}:</Text>
      <Text style={[adminStyles.detailValue, { flex: 1 }, valueStyle]}>{value}</Text>
    </View>
  );
}

//TODO dodany cały nowy komponent - wyświetla szczegóły rekordów w formie nazwa + wartość w jednym wierszu