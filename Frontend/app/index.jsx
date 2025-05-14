import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link } from "expo-router";
import axios from "axios";

export default function Index() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:5000/api/index");
      setMessage(response.data.message);
    } catch (err) {
      setError("Błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Text>Ładowanie...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../assets/images/WelcomePageMainImage.png")}
          style={styles.illustrationImage}
        />
      </View>

      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <View style={styles.button}>
        <Link
          style={[styles.homeViewButtonsText, styles.buttonText]}
          href={"/(auth)/login"}
        >
          Login
        </Link>
      </View>
      <View style={styles.button}>
        <Link
          style={[styles.homeViewButtonsText, styles.buttonText]}
          href={"/(auth)/register"}
        >
          Register
        </Link>
      </View>
    </View>
  );
}
