import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const adminStyles = StyleSheet.create({
  // Kontener główny
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  // Nagłówek
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },

  // Przycisk główny
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

  // Lista i elementy listy
  list: {
    marginTop: 8,
    marginBottom: 16,
  },
  listItemWithActions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: 16,
  },

  // Akcje (edytuj/usuń)
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
    // justifyContent: 'flex-end',
    // flex: 0,
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Grid menu admina
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
});

export default adminStyles;
