import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView, FlatList, StyleSheet, Image, SafeAreaView, Switch, Pressable, Alert } from 'react-native';
import {  Provider , Card, Text, Searchbar } from 'react-native-paper';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {Add, PosAdd, ConfigPerfil, Favoritos, AnimalDesc, HomeScreenJur, Login, Inicio, PessoaFisicaCadastro, PessoaJuridicaCadastro, TelaAdocao} from './rotas';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import logo from '../imgs/logo_Inicio.png';
import logo2 from '../imgs/LOGO.png';
import Modal from 'react-native-modal';
import { getFirestore, collection, docs, getDocs, query, where, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { BlurView } from 'expo-blur';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const db = getFirestore();


export default function HomeScreen({ route }) {

  return (
    <NavigationContainer independent={true}>
    <DrawerNavigator/>
  </NavigationContainer>

  );
}

      function Tabs({ navigation, route }) {

      return (
      <Tab.Navigator screenOptions={{
      tabBarLabelStyle: {
      fontWeight: 'bold', // Estilo da fonte das guias
      },
      tabBarActiveTintColor: '#FFAE2E', // Cor do texto da guia ativa
      tabBarInactiveTintColor: '#143D9B', // Cor do texto da guia inativa
      tabBarStyle: {
      backgroundColor: '#2163D3',
      // Cor de fundo da barra de guias
      },
      }}>
      <Tab.Screen 
      name='Casa' 
      component={Casa} 
      options={{ 
        headerShown: false, 
        tabBarLabel: '', 
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="home" size={size} color={color} style={{ marginTop:8,}} />
        ),
      }} 
      />
      <Tab.Screen 
      name='Favoritos' 
      component={Favoritos} 
      options={{ 
        headerShown: false, 
        tabBarLabel: '', 
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="heart" size={size} color={color} style={{ marginTop:8,}} />
        ),
      }} 
      />
      <Tab.Screen 
      name='Configurações' 
      component={ConfigPerfil}  
      options={{ 
        headerShown: false, 
        tabBarLabel: '', 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} style={{ marginTop:8,}} />
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
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário autenticado:', user);
        const pessoasFisicasRef = collection(db, 'PessoasFisicas');
        const q = query(pessoasFisicasRef, where('userUid', '==', user.uid));
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDocSnapshot = querySnapshot.docs[0]; // Assume que há apenas um documento correspondente
            console.log('Dados do usuário:', userDocSnapshot.data());
            const userData = userDocSnapshot.data();
            setUserName(userData.nome);
            setUserEmail(userData.email);
            setUserId(userData.userUid);

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
        label="Adicionar animal"
        onPress={() => navigation.navigate('AdicionarAnimal')} 
        labelStyle={styles.drawerItem} />
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
    }} />
    <Drawer.Screen name='AdicionarAnimal' component={Add} options={{
      title: null,
      headerStyle: {
        backgroundColor: "#2163D3",
      },
    }} /> 
     <Drawer.Screen name='PosAdd' component={PosAdd} options={{
      title: null,
      headerStyle: {
        backgroundColor: "#2163D3",
      },
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
      <Drawer.Screen name='HomeJur' component={HomeScreenJur} options={{
      title: null,
      headerShown: false

    }} />
      <Drawer.Screen name='Login' component={Login} options={{
      title: null,
      headerShown: false

    }} />
      <Drawer.Screen name='Inicio' component={Inicio} options={{
      title: null,
      headerShown: false

    }} /> 
         <Drawer.Screen name='ConfigPerfil' component={ConfigPerfil} options={{
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

const Casa = ({ navigation, route }) => {
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  const [animais, setAnimais] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [userId, setUserId] = useState('');
  const [sId, setsId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const pessoasFisicasRef = collection(db, 'PessoasFisicas');
        const q = query(pessoasFisicasRef, where('userUid', '==', user.uid));
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDocSnapshot = querySnapshot.docs[0]; // Assume que há apenas um documento correspondente

            const userData = userDocSnapshot.data();
          
            setUserId(userData.userUid);
            if (userData.horas != "4 a 8" && userData.horas != "8 a 12" && userData.horas != "4 ou Menos"  && userData.horas != "12 ou Mais") {
              setShowModal(true);
              return;
          }

          } 
        } catch (error) {
          console.error('Erro ao buscar informações do usuário no Firestore', error);
        }
      } 
    });
  }, []);
  const fetchFavoritos = async () => {
    try {
      const userDocRef = doc(db, 'PessoasFisicas', userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setFavoritos(userData.favoritos || []);
      } else {
        console.log('Documento do usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos do usuário no Firestore', error);
    }
  };
  
  const handleAdicionarFavorito = async (animal) => {
    Alert.alert("ANIMAL ADICIONADO AOS FAVORITOS");
    try {
      const updatedFavoritos = [...favoritos, { ...animal, userId: userId }];
      const userDocRef = doc(db, 'PessoasFisicas', userId);
      await setDoc(userDocRef, { favoritos: updatedFavoritos }, { merge: true });
  
      // Atualize o estado local para refletir as alterações
      setFavoritos(updatedFavoritos);
    } catch (error) {
      console.error('Erro ao favoritar o animal:', error);
    }
  };
  
  
  
  
  const fetchAnimais = async () => {
    const animaisCollection = collection(db, 'Animais');
    const animaisQuery = await getDocs(animaisCollection);

    const animaisData = [];
    animaisQuery.forEach((doc) => {
      const animal = doc.data();
      animaisData.push(animal);
    });

    setAnimais(animaisData);

  };

  useEffect(() => {
    fetchAnimais(); 
    fetchFavoritos();// Chama a função para buscar os dados quando o componente é montado
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Executa essa função sempre que a tela é focada
      fetchAnimais();
      fetchFavoritos();
       // Chama a função para buscar os dados novamente
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
  
  const closeModal = () => {
    setShowModal(false);
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
          <Text onPress={() => del('delete')} style={[styles.animalText2, styles.doado]}>NÃO IREI DELETAR POR OUTRO MOTIVO</Text>
           <Text onPress={() => ado('adopted')} style={[styles.animalText2, styles.doado]}>SIM, CONSEGUI</Text>
           <Text onPress={() => closeModal2()} style={[styles.animalText2, styles.doado]}>FECHAR</Text>

          </View>
        </View>
      </Modal>
      <Modal
   animationType="slide"
   transparent={true}
   visible={showModal}
   onRequestClose={closeModal}
 >
<BlurView style={styles.containerModal} intensity={35} tint="light">

   <View style={styles.modalContainer}>
     <View style={styles.modalContent}>
       <Text style={styles.modalText}>
         Complete seu perfil para aproveitar ao máximo nosso aplicativo!
       </Text>
       <Pressable
         style={styles.modalButton}
         onPress={() => {
           closeModal();
           navigation.navigate('ConfigPerfil');
         }}
       >
         <Text style={styles.buttonText}>Completar Perfil</Text>
       </Pressable>
     </View>
   </View>
   </BlurView>
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
            style={{margin:40}}
              name="check-circle"
              size={30}
              color="green"
              onPress={() => {
                handleExitApp();
              }}
            />
            <FontAwesome5
              style={{margin:40}}
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
          <Text  style={styles.AnimalsText}>ANIMAIS PARA ADOÇÃO:</Text>
          <FlatList
            data={filterAnimals()}
            numColumns={2}
              keyExtractor={(item) => item.ID}
            renderItem={({ item }) => (
              <Pressable
              style={[styles.animalCard]}
              onPress={() => {
                navigation.navigate('AnimalDesc', { animalId: item.ID });
              }}
              >
             <AnimalCard
              animal={item}
              onAdicionarFavorito={() => handleAdicionarFavorito(item)}
              userId={userId}
              onOpenModal2={openModal2}
              onDeleted={handleDeleteAnimal}
              onAdopted={handleMarkAsAdopted}

              />

               
    </Pressable>
  )}
/>
        </View>
      </ScrollView>
    </Provider>
  );
}

const AnimalCard = ({ animal, onAdicionarFavorito, userId, onOpenModal2,onAdopted, onDeleted  }) => (
  <Card style={{backgroundColor:"white", borderRadius:10}}>
    <Card.Cover style={[styles.animalImage]} source={{uri: animal.images[0]}} />
    <Card.Content style={{backgroundColor:"white", borderRadius:10}}>
      <Text variant="titleLarge" style={styles.animalText}>{animal.name}</Text>
      <Text variant="bodyMedium" style={styles.animalText}>{animal.raça}</Text>
      <Text variant="bodyMedium" style={styles.animalText}>{animal.sexo}</Text>
      <Text variant="bodyMedium" style={[styles.animalText, styles.animalLocal]}>{animal.cidade}-{animal.estado}</Text>
      {animal.userType === "userJur" && (
        <Text variant="bodyMedium" style={[style={color:'#FFAE2E'}, styles.animalLocal]}>DIVULGADO POR UMA ONG :)</Text>
      )}
        {animal.userId === userId && (
                    <Text variant="bodyMedium"style={[styles.animalText3, styles.deletar]} onPress={() => {
                      onOpenModal2();
                      onAdopted(animal.ID);
                      onDeleted(animal.ID);
                    }} >DELETAR</Text>
      )}

      <Pressable onPress={onAdicionarFavorito} style={{ alignSelf: "flex-start" }}>
        <FontAwesome5 name="heart" size={22} color="#2163D3" />
      </Pressable>
    </Card.Content>
  </Card>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
 
  animalCard: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor:'white',
    
  },
  deletar:{
    textAlign:'center',
    padding:5,
    fontWeight: 'bold',
    borderWidth:2,
    borderRadius:4,
    marginBottom:10,
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
  animalText: {
    color: 'black',
  },
  animalText2: {
    color: '#2163D3',
    marginTop:12
  },
  animalText3: {
    color: 'red',
    marginTop:12
  },
  animalLocal: {
    textAlign: 'right',
    fontWeight: 'bold',
  },
  animalImage: {
    marginBottom: 20,
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
  flatListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  AnimalsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color:'#000'
  },
  doaModal: {
    backgroundColor: 'lightgrey',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  exitModalContainer: {
    backgroundColor: 'lightgrey',
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
    color:'black'
  },
  exitModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin:10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%',
    width:'100%'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color:'black'
  },
  modalButton: {
    backgroundColor: '#2163D3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
  },
  containerModal: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});




