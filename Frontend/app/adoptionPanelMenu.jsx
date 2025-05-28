// import { View, Text, TouchableOpacity, ScrollView } from "react-native";
// import styles from "../assets/styles/main.styles";
// import { Image } from "expo-image";
// import { Link, useRouter } from "expo-router";
// import COLORS from "../constants/colors";

// export default function adoptionPanel() {
//   const router = useRouter();

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//     <View style={styles.container}>
//       <Text style={styles.header}>Adoption Panel</Text>
//       <View style={styles.adpotionMenuContainer}>
//         <Image
//           style={styles.adoptionPanelMenuImage}
//           source={require("../assets/images/DogImage.png")}
//         >
//           <Link href={"/index"}></Link>
//         </Image>
//         <Link style={styles.title} href={"/adoptDogList"}>
//           Dogs
//         </Link>
//       </View>
//       <View style={styles.adpotionMenuContainer}>
//         <Image
//           style={styles.adoptionPanelMenuImage}
//           source={require("../assets/images/CatImage.png")}
//         >
//           <Link href={"/index"}></Link>
//         </Image>
//         <Link style={styles.title} href={"/adoptCatList"}>
//           Cats
//         </Link>
//       </View>
//       <View style={styles.adpotionMenuContainer}>
//         <Image
//           style={styles.adoptionPanelMenuImage}
//           source={require("../assets/images/RabbitImage.png")}
//         >
//           <Link href={"/index"}></Link>
//         </Image>
//         <Link style={styles.title} href={"/adoptOtherAnimalList"}>
//           Other animals
//         </Link>
//       </View>
//       <TouchableOpacity
//         style={[
//           styles.button,
//           { backgroundColor: COLORS.primary, marginTop: 20 },
//         ]}
//         onPress={() => router.push("/mainMenu")}
//       >
//         <Text style={styles.buttonText}>Back to Main Menu</Text>
//       </TouchableOpacity>
//     </View>
//     </ScrollView>
//   );
// }

import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "../assets/styles/main.styles";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import COLORS from "../constants/colors";

export default function AdoptionPanel() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Adoption Panel</Text>

        <View style={styles.adpotionMenuContainer}>
          <Link href="/adoptDogList" asChild>
            <TouchableOpacity>
              <Image
                style={styles.adoptionPanelMenuImage}
                source={require("../assets/images/DogImage.png")}
              />
            </TouchableOpacity>
          </Link>
          <Link style={styles.title} href="/adoptDogList">
            Dogs
          </Link>
        </View>

        <View style={styles.adpotionMenuContainer}>
          <Link href="/adoptCatList" asChild>
            <TouchableOpacity>
              <Image
                style={styles.adoptionPanelMenuImage}
                source={require("../assets/images/CatImage.png")}
              />
            </TouchableOpacity>
          </Link>
          <Link style={styles.title} href="/adoptCatList">
            Cats
          </Link>
        </View>

        <View style={styles.adpotionMenuContainer}>
          <Link href="/adoptOtherAnimalList" asChild>
            <TouchableOpacity>
              <Image
                style={styles.adoptionPanelMenuImage}
                source={require("../assets/images/RabbitImage.png")}
              />
            </TouchableOpacity>
          </Link>
          <Link style={styles.title} href="/adoptOtherAnimalList">
            Other animals
          </Link>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.primary, marginTop: 20 },
          ]}
          onPress={() => router.push("/mainMenu")}
        >
          <Text style={styles.buttonText}>Back to Main Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
