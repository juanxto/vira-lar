import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', // Cor de fundo branca
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:'50%',
    },
    containerModal: {
      flex: 1,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    logo: {
      width:220, 
      height: 220, 
      marginBottom:-5
    },
    logo2: {
      width:220, 
      height: 220, 
      marginBottom: 10
    },
    buttonsContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#2163D3', //Azul
      textAlign: 'center',
      alignSelf:'center',
      paddingVertical:15,
      borderRadius: 8,
      marginHorizontal: 10,
      height: 50,
      width: 150,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      textAlign: 'center',
      fontWeight:'bold'
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    line: {
      width:20,
      height: 5,
      backgroundColor: '#2163D3',
      marginHorizontal: 2,
    },
  });
  
  export default styles;

  