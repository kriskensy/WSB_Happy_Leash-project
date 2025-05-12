import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import styles from "../assets/styles/main.styles";

const screenWidth = Dimensions.get("window").width;

export default function PetDetails() {
  const { petId } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPet = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/pet/${petId}`);
      const data = await response.json();
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petId) {
      fetchPet();
    }
  }, [petId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={[styles.subtitle, { color: "red" }]}>
          No pet data available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, localStyles.scrollContainer]}
    >
      <Image
        source={{ uri: pet.pictureURL }}
        style={localStyles.image}
        contentFit="cover"
      />
      <Text style={localStyles.name}>{pet.name}</Text>

      <View style={localStyles.card}>
        <Text style={styles.description}>Age: {pet.age} years</Text>
        <Text style={styles.description}>Weight: {pet.weight} kg</Text>
        <Text style={styles.description}>
          Gender: {formatGender(pet.gender)}
        </Text>
        <Text style={styles.description}>
          Type: {pet.petType?.name || "Unknown"}
        </Text>
        <Text style={styles.description}>
          Breed: {pet.breed?.name || "Unknown"}
        </Text>
        <Text style={styles.subtitle}>
          Notes: {pet.notes || "No notes available."}
        </Text>
      </View>

      <View style={localStyles.card}>
        <Text style={localStyles.sectionTitle}>Tags</Text>
        {pet.petTags?.length > 0 ? (
          pet.petTags.map((pt) => (
            <Text key={pt.id} style={styles.description}>
              - {pt.tag?.name || "Unknown"}
            </Text>
          ))
        ) : (
          <Text style={styles.subtitle}>No tags</Text>
        )}
      </View>

      <View style={localStyles.card}>
        <Text style={localStyles.sectionTitle}>Health Records</Text>
        {pet.healthRecords?.length > 0 ? (
          pet.healthRecords.map((hr) => (
            <View key={hr.id} style={{ marginBottom: 12 }}>
              <Text style={styles.description}>
                📅 {hr.recordDate?.split("T")[0]}
              </Text>
              <Text style={styles.description}>🩺 {hr.description}</Text>
              <Text style={styles.subtitle}>
                👨‍⚕️ {hr.vetName || "Unknown vet"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.subtitle}>No health records</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text
          style={[
            styles.buttonText,
            { width: screenWidth * 0.85, textAlign: "center" },
          ]}
        >
          Adopt ME!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const formatGender = (gender) => {
  if (gender === 1) return "Male";
  if (gender === 2) return "Female";
  return "Unknown";
};

const localStyles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  image: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.75,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: screenWidth * 0.85,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
});
