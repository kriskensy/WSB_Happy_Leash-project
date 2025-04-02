import { View, Text, FlatList } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";

export default function aboutTeam() {
  const teamMembers = [
    {
      id: 0,
      firstName: "Patryk",
      lastName: "Wojewoda",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit magna sit amet eros placerat, ac volutpat odio laoreet. Nam ac lacinia orci, at tincidunt nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit magna sit amet eros placerat, ac volutpat odio laoreet. Nam ac lacinia orci, at tincidunt nisl.",
      image: require("../assets/images/profilePatryk.png"),
    },
    {
      id: 1,
      firstName: "Krzysztof",
      lastName: "Kensy",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit magna sit amet eros placerat, ac volutpat odio laoreet. Nam ac lacinia orci, at tincidunt nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit magna sit amet eros placerat, ac volutpat odio laoreet. Nam ac lacinia orci, at tincidunt nisl.",
      image: require("../assets/images/RabbitImage.png"),
    },
  ];
  const renderItem = ({ item }) => (
    <View>
      <View style={styles.aboutTeamContainer}>
        <Image style={styles.profileImage} source={item.image} />
        <Text style={styles.title}>{item.firstName + " " + item.lastName}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>About our team</Text>
      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={(teamMember) => teamMember.id.toString()}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
