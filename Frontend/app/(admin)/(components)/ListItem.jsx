import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import adminStyles from "../../../assets/styles/admin.styles";
import COLORS from "../../../constants/colors";

export default function ListItem({
  title,
  subtitle,
  onPress,
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  leftImage, // <--- dodaj
}) {
  return (
    <View
      style={[
        adminStyles.listItemWithActions,
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      ]}
    >
      {/* Zdjęcie po lewej */}
      {leftImage && <View style={{ marginRight: 10 }}>{leftImage}</View>}

      {/* Tekst w środku */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Text style={adminStyles.listItemTitle} numberOfLines={2}>
          {title}
        </Text>
        {Array.isArray(subtitle)
          ? subtitle.map((line, idx) => (
              <Text
                key={idx}
                style={adminStyles.listItemSubtitle}
                numberOfLines={2}
              >
                {line}
              </Text>
            ))
          : subtitle && (
              <Text style={adminStyles.listItemSubtitle} numberOfLines={5}>
                {subtitle}
              </Text>
            )}
      </TouchableOpacity>

      {/* Ikony po prawej */}
      <View style={adminStyles.actionButtons}>
        {showEdit && (
          <TouchableOpacity
            style={adminStyles.actionButton}
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${title}`}
          >
            <Ionicons name="pencil" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showDelete && (
          <TouchableOpacity
            style={adminStyles.actionButton}
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${title}`}
          >
            <Ionicons name="trash" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
