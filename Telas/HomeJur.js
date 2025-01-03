import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { View, Pressable, ScrollView, FlatList, StyleSheet, Image, SafeAreaView, Switch, Modal, Alert } from 'react-native';
import {  Provider , Card, Text, Searchbar } from 'react-native-paper';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {Add, PosAdd, ConfigPerfil, Favoritos, AnimalDesc, Login, Inicio, HomeScreen, PessoaFisicaCadastro, PessoaJuridicaCadastro, TelaAdocao} from './rotas';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import logo from '../imgs/logo_Inicio.png';
import logo2 from '../imgs/LOGO.png';
import { getFirestore, collection, docs, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const db = getFirestore();


export default function HomeScreenJur({ route }) {

  return (
    <NavigationContainer independent={true}>
      <DrawerNavigator />
    </NavigationContainer>

  );
}
function Tabs({ navigation }) {
  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: {
        fontWeight: 'bold', // Estilo da fonte das guias
      },
      tabBarActiveTintColor: '#FFAE2E', // Cor do texto da guia ativa
      tabBarInactiveTintColor: '#143D9B', // Cor do texto da guia inativa
      tabBarStyle: {
        backgroundColor: '#2163D3', // Cor de fundo da barra de guias
      },
    }}>
      <Tab.Screen 
        name='Casa' 
        component={Casa} 
        options={{ 
          headerShown: false, 
          tabBarLabel: '', 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name='Add' 
        component={Add} 
        
        options={{ 
          headerShown: false, 
          tabBarLabel: '', 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          ),
        }} 
      />
   
    </Tab.Navigator>
  );
}


  function CustomDrawerContent({ navigation, ...props }) {
    const [isDarkMode, setIsDarkMode] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    useEffect(() => {
      const auth = getAuth();
      const db = getFirestore();
  
      onAuthStateChanged(auth, async (userJur) => {
        if (userJur) {
          console.log('Usuário autenticado:', userJur);
  
          const PessoasJuridicasRef = collection(db, 'PessoasJuridicas');
          const q = query(PessoasJuridicasRef, where('userUid', '==', userJur.uid));
  
          try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userDocSnapshot = querySnapshot.docs[0]; // Assume que há apenas um documento correspondente
              console.log('Dados do usuário:', userDocSnapshot.data());
              const userData = userDocSnapshot.data();
              setUserName(userData.nome);
              setUserEmail(userData.email);
            } else {
              console.log('Documento do usuário não encontrado');
            }
          } catch (error) {
            console.error('Erro ao buscar informações do usuário no Firestore', error);
          }
        } else {
          console.log('Usuário não está autenticado');
          setUserName('');
          setUserEmail('');
        }
      });
    }, []);

    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.containerDrawer}>
          <View  style={styles.userArea}>
            <Image
              source={logo}
              style={styles.user}
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.nome}>{userName}</Text>
              <Text style={styles.email}>{userEmail}</Text>
            </View>
          </View>
        </View>
  
        <DrawerItem 
          label="LOGOUT" 
          onPress={() => handleLogout(navigation)} // Utiliza a função handleLogout
          labelStyle={styles.drawerItem} />

      
      </DrawerContentScrollView>
    );
  }
  
  // Adiciona a função handleLogout
  const handleLogout = async (navigation) => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  function DrawerNavigator() {
   
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
       <Drawer.Screen name="Home" component={Tabs} options={{
     title: "ADOTE SEM RÓTULOS",
     headerStyle: {
       backgroundColor: "#2163D3",
     },
     headerTitleStyle:{
       fontWeight: 'bold',
       color: '#FFAE2E',
     },
     headerTitleAlign:'center',
     headerRight: () => (
    <Image
    source={logo2}
    style={{height:30, width:30, marginRight:10}}
    />
     ),
   }}   />
       <Drawer.Screen name='PosAdd' component={PosAdd} options={{
      title: null,
      headerShown: false

    }} /> 
    <Drawer.Screen name='AnimalDesc' component={AnimalDesc} options={{
      title: "ADOTE SEM RÓTULOS",
      headerStyle: {
        backgroundColor: "#2163D3",
      },
      headerTitleStyle:{
        fontWeight: 'bold',
        color: '#FFAE2E',
      },
      headerTitleAlign:'center',
      headerRight: () => (
     <Image
     source={logo2}
     style={{height:30, width:30, marginRight:10}}
     />
      ),
    }} /> 
    <Drawer.Screen name='Inicio' component={Inicio} options={{
      title: null,
      headerShown: false

    }} /> 
     <Drawer.Screen name='ConfigPerfil' component={ConfigPerfil} options={{
      title: null,
      headerShown: false

    }} /> 
      <Drawer.Screen name='HomeJur' component={HomeScreenJur} options={{
      title: null,
      headerShown: false

    }} /> 
         <Drawer.Screen name='HomeScreen' component={HomeScreen} options={{
      title: null,
      headerShown: false

    }} /> 
            <Drawer.Screen name='PessoaJuridicaCadastro' component={PessoaJuridicaCadastro} options={{
      title: null,
      headerShown: false

    }} /> 
            <Drawer.Screen name='PessoaFisicaCadastro' component={PessoaFisicaCadastro} options={{
      title: null,
      headerShown: false

    }} /> 
       <Drawer.Screen name='TelaAdocao' component={TelaAdocao} options={{
      title: null,
      headerShown: false

    }} /> 
    </Drawer.Navigator>
  );
}


function Casa({ navigation, route }) {
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  const [animais, setAnimais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [sId, setsId] = useState('');



  const fetchAnimais = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const animaisCollection = collection(db, 'Animais');
      const animaisQuery = await getDocs(animaisCollection);

      const animaisData = [];
      animaisQuery.forEach((doc) => {
        const animal = doc.data();
        if (animal.userId === user.uid) {
          animaisData.push(animal);
        }
      });

      setAnimais(animaisData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimais();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAnimais();
    }, [])
  );

  const filterAnimals = () => {
    if (selectedFilter === 'TODOS') {
      return animais;
    } else {
      return animais.filter((animal) => animal.tipo.toLowerCase() === selectedFilter.toLowerCase());
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Mostra o modal quando o botão de retorno é pressionado
      setModalVisible(true);
      // Retorna true para impedir o comportamento padrão (fechar o aplicativo)
      return true;
    });

    return () => {
      // Remove o ouvinte do BackHandler ao desmontar o componente
      backHandler.remove();
    };
  }, []); // Certifique-se de passar um array vazio para useEffect para que ele só seja executado uma vez

  const handleExitApp = () => {
  
    // Fecha o modal
    setModalVisible(false);

    // Fecha o aplicativo
    BackHandler.exitApp();
  };

  const handleCancelExit = () => {
    // Fecha o modal sem fechar o aplicativo
    setModalVisible(false);
  };
  
  const handleMarkAsAdopted = async (animalId) => {
    setsId(animalId)

    
  };

  const ado = async (action) => {
    setModalVisible2(true);
if(action === 'adopted'){
  try {
    // Remova o animal do banco de dados Firestore
    const animaisRef = collection(db, 'Animais');
    await deleteDoc(doc(animaisRef, sId));
    Alert.alert(
      "PARABENS POR DOAR UM PET",
      "FICAMOS FELIZES QUE TENHA CONSEGUIDO DOAR SEU ANIMALZINHO. NÃO ESQUEÇA DE SEMPRE ESTAR VERIFICANDO SE ELE ESTÁ SENDO BEM CUIDADO (:"
    );
    // Atualize o estado local para refletir a remoção do animal
    setAnimais((prevAnimais) => prevAnimais.filter((animal) => animal.ID !== sId));
  } catch (error) {
    console.error('Erro ao marcar como adotado:', error);
  }
  finally {
    // Fecha o modal
    setModalVisible2(false);
  }
}
    
  };
  

  const handleDeleteAnimal = async (animalId) => {
    setsId(animalId)
   
  };

  const del = async (action) => {
    setModalVisible2(true);
    if (action === 'delete'){
      try {
        // Remova o animal do banco de dados Firestore
        const animaisRef = collection(db, 'Animais');
        await deleteDoc(doc(animaisRef, sId));
        Alert.alert("ANIMAL DELETADO")     
  
        // Atualize o estado local para refletir a remoção do animal
        setAnimais((prevAnimais) => prevAnimais.filter((animal) => animal.ID !== sId));
      } catch (error) {
        console.error('Erro ao marcar como adotado:', error);
      }
      finally {
        // Fecha o modal
        setModalVisible2(false);
      }
    }
  }   
  

  

  const openModal2 = () => {
    // Fecha o modal
    setModalVisible2(true);
  };
  const closeModal2 = () => {
    // Fecha o modal
    setModalVisible2(false);
  };


  return (
    <Provider>
      <ScrollView style={styles.container}>
      <Modal  animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Trata o fechamento do modal (pode ser vazio se você quiser permitir o fechamento padrão do modal)
          setModalVisible2(false);
        }}>
        <View style={styles.doaModal}>
          <Text style={styles.exitModalText}>CONSEGUIU DOAR O PET?</Text>
          <View>
          <Text onPress={() => del('delete')} style={[styles.animalText2, styles.doado]}>NÃO, IREI DELETAR POR OUTRO MOTIVO</Text>
           <Text onPress={() => ado('adopted')} style={[styles.animalText2, styles.doado]}>SIM, CONSEGUI</Text>
           <Text onPress={() => closeModal2()} style={[styles.animalText2, styles.doado]}>FECHAR</Text>

          </View>
        </View>
      </Modal>
      <Modal  animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Trata o fechamento do modal (pode ser vazio se você quiser permitir o fechamento padrão do modal)
          setModalVisible(false);
        }}>
        <View style={styles.exitModalContainer}>
          <Text style={styles.exitModalText}>Deseja fechar o aplicativo?</Text>
          <View style={styles.exitModalButtons}>
            <FontAwesome5
              name="check-circle"
              size={30}
              color="green"
              onPress={() => {
                handleExitApp();
              }}
            />
            <FontAwesome5
              name="times-circle"
              size={30}
              color="red"
              onPress={() => {
                handleCancelExit();
              }}
            />
          </View>
        </View>
      </Modal>
        <View style={styles.animalList}>
          {isLoading ? (
            <Text style={styles.AnimalsText}>Carregando...</Text>
          ) : animais.length === 0 ? (
            <Text style={styles.AnimalsText}>NENHUM ANIMAL DIVULGADO</Text>
          ) : (
            <>
              <View style={styles.filterContainer}>
              <Pressable
              onPress={() => setSelectedFilter('TODOS')}
              style={[
                styles.filterCard,
                selectedFilter === 'TODOS' ? { backgroundColor: '#2163D3' } : null,
              ]}
            >
              <Text
                style={[
                  styles.textFilter,
                  selectedFilter === 'TODOS' ? { color: '#FFAE2E' } : null,
                ]}
              >
                TODOS
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedFilter('Gato')}
              style={[
                styles.filterCard,
                selectedFilter === 'Gato' ? { backgroundColor: '#2163D3' } : null,
              ]}
            >
              <FontAwesome5 name="cat" size={24} color={selectedFilter === 'Gato' ? '#FFAE2E' : 'black'} />
            </Pressable>
            <Pressable
              onPress={() => setSelectedFilter('Cachorro')}
              style={[
                styles.filterCard,
                selectedFilter === 'Cachorro' ? { backgroundColor: '#2163D3' } : null,
              ]}
            >
              <FontAwesome5 name="dog" size={24} color={selectedFilter === 'Cachorro' ? '#FFAE2E' : 'black'} />
            </Pressable>              
            </View>
            <Text  style={styles.AnimalsText}>ANIMAIS POSTADOS:</Text>
              <FlatList
                data={filterAnimals()}
                numColumns={2}
                keyExtractor={(item) => item.ID}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.animalCard}
                    onPress={() => navigation.navigate('AnimalDesc', { animalId: item.ID })}
                  >
                      <AnimalCard animal={item} 
                      onOpenModal2={openModal2}
                      onDeleted={handleDeleteAnimal}
                      onAdopted={handleMarkAsAdopted} />
                  </Pressable>
                )}
              />
            </>
          )}
        </View>
      </ScrollView>
    </Provider>
  );
}

const AnimalCard = ({ animal, onOpenModal2,onAdopted, onDeleted }) => (
  <Card style={{backgroundColor:"white", borderRadius:10}}>
    <Card.Cover style={styles.animalImage} source={{uri: animal.images[0]}} />
    <Card.Content>
      <Text variant="titleLarge" style={styles.animalText}>{animal.name}</Text>
      <Text variant="bodyMedium" style={styles.animalText}>{animal.raça}</Text>
      <Text variant="bodyMedium" style={styles.animalText}>{animal.sexo}</Text>
      <Text variant="bodyMedium" style={[styles.animalText, styles.animalLocal]}>{animal.cidade}-{animal.estado}</Text>
      <Text variant="bodyMedium"style={[styles.animalText3, styles.deletar]} onPress={() => {
                      onOpenModal2();
                      onAdopted(animal.ID);
                      onDeleted(animal.ID);
                    }} >DELETAR</Text>
    </Card.Content>
  </Card>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  animalText2: {
    color: '#2163D3',
    marginTop:12
  },
  animalText3: {
    color: 'red',
    marginTop:12
  },
  doado:{
    textAlign:'center',
    padding:5,
    fontWeight: 'bold',
    borderWidth:2,
    borderRadius:4,
    marginBottom:10,
    margin:50,
  },
  deletar:{
    textAlign:'center',
    padding:5,
    fontWeight: 'bold',
    borderWidth:2,
    borderRadius:4,
    marginBottom:10,
  },
 
  doaModal: {
    backgroundColor: 'lightgrey',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width:'95%',
    marginTop:'80%',
    alignSelf:'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  searchInput: {
    marginRight: '20%',
    borderRadius: 20,
    fontSize: 16,
    color: 'black',
    width: "80%",
    height: "85%",
    paddingLeft: 10, 
    paddingRight: 10, 
    borderColor: '#FFAE2E', 
    borderWidth: 2, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
  },
  menuButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  
  animalCard: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor:'white',
    
  },
  animalText: {
    color: 'black',
  },
  animalLocal: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  animalImage: {
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    width: "40%",
    height: "100%",
    backgroundColor: 'white',
  },
  //DRAWER
  containerDrawer:{
    flex:1,
    backgroundColor: 'lightblue',
  },
  userArea:{
    padding: 10,
    margin: 10,
    flexDirection: 'row',
    borderColor: 'blue',
    borderBottomWidth: 4,
    borderRadius: 2,
    width:200

  },
  user:{
    height: 60,
    width: 60,
    marginRight: 20,
    borderRadius: 40,
  },
  nome:{
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'navy'
  },
  email:{
    fontSize: 15,
    marginBottom: 8,
    color: 'darkblue', 
  },
  drawerItem: {
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  //FILTER
  filterContainer:{
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center', 
  },

  filterCard:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth:1,
    margin: 5,
  },
  textFilter:{
    fontSize: 12,
    fontFamily: "sans-serif-light",
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  darkModeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  darkModeLabel: {
    fontSize: 16,
  },
  AnimalsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color:'#000'
  },
  exitModalContainer: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  exitModalText: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight:'bold',
    color:"black"
    },
  exitModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin:10,
  },
});
