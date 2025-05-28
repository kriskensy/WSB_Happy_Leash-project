import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminHeaderTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  list: {
    marginTop: 8,
    marginBottom: 16,
  },

  //TODO zmienione stylowanie wedle buttonów wychodzących poza ekran
  listItemWithActions: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.cardBackground,
  borderRadius: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: 15,
  width: '100%',
  minWidth: 0,
  },
  listItemContent: {
    flex: 1,
    minWidth: 0,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
    flexShrink: 0,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  adminMenuItem: {
    width: '48%',
    padding: 15,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: 12,
    marginBottom: 10,
    flex: 1,
  },
  adminMenuItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 5,
    marginBottom: 2,
  },
  adminMenuItemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  //TODO checkboxy
  checkboxContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default adminStyles;