import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const modalStyles = StyleSheet.create({

  modalOverlay: { 
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 24, 
    width: '80%', 
    maxHeight: 400 
  },

  modalItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },

  modalCloseButton: { 
    marginTop: 16, 
    alignSelf: 'center' 
  },

});

export default modalStyles;
