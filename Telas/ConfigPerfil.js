import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';



const ConfigPerfil = ({ route, navigation }) => {
  const db = getFirestore();
  const auth = getAuth();

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [endereco, setEndereco] = useState('')
  const [generoFeminino, setGeneroFeminino] = useState(false);
  const [generoMasculino, setGeneroMasculino] = useState(false);
  const [criancasSim, setCriancasSim] = useState(false);
  const [criancasNao, setCriancasNao] = useState(false);
  const [moradiaCasa, setMoradiaCasa] = useState(false);
  const [moradiaApartamento, setMoradiaApartamento] = useState(false);
  const [espacoPequeno, setEspacoPequeno] = useState(false);
  const [espacoMedio, setEspacoMedio] = useState(false);
  const [espacoGrande, setEspacoGrande] = useState(false);
  const [possuiPetsSim, setPossuiPetsSim] = useState(false);
  const [possuiPetsNao, setPossuiPetsNao] = useState(false);
  const [horas4ouMenos, setHoras4ouMenos] = useState(false);
  const [horas4a8, setHoras4a8] = useState(false);
  const [horas8a12, setHoras8a12] = useState(false);
  const [horas12ouMais, setHoras12ouMais] = useState(false);
  const [ocupacao, setOcupacao] = useState('');
  const [numPessoas, setNumPessoas] = useState('');
  const [conheceuRedes, setConheceuRedes] = useState({
    instagram: false,
    facebook: false,
    twitter: false,
    linkedin: false,
  });
  const [selectedButtons, setSelectedButtons] = useState({
    genero: null,
    criancas: null,
    moradia: null,
    espaco: null,
    possuiPets: null,
    horas: null,
  });

  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const saveSelections = async () => {
    try {
      const userSelectionsKey = `selectedButtons_${userId}`;
      await AsyncStorage.setItem(userSelectionsKey, JSON.stringify(selectedButtons));
    } catch (error) {
      console.error('Erro ao salvar seleções:', error);
    }
  };
  

  // Função para carregar as seleções do AsyncStorage
  const loadSelections = async () => {
    try {
      const userSelectionsKey = `selectedButtons_${userId}`;
      const savedSelections = await AsyncStorage.getItem(userSelectionsKey);
      if (savedSelections) {
        setSelectedButtons(JSON.parse(savedSelections));
      }
    } catch (error) {
      console.error('Erro ao carregar seleções:', error);
    }
  };
  
 useEffect(() => {

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log('Usuário autenticado:', user);
      const pessoasFisicasRef = collection(db, 'PessoasFisicas');
      const q = query(pessoasFisicasRef, where('userUid', '==', user.uid));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDocSnapshot = querySnapshot.docs[0];
          setUserId(userDocSnapshot.id); 
          const userDocRef = doc(db, 'PessoasFisicas', userDocSnapshot.id);


        } else {
          console.log('Documento do usuário não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário no Firestore', error);
      }
    }
  });
  
  const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'PessoasFisicas',userId );
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setNome(userData.nome);
          setDataNascimento(userData.dataNascimento);
          setEmail(userData.email);
          setCelular(userData.celular);
          setCidade(userData.cidade);
          setEstado(userData.estado);
          setOcupacao(userData.ocupacao);
          setNumPessoas(userData.numPessoas);
          setIsLoading(false);


                } else {
          console.warn('Documento do usuário não encontrado no Firestore');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário no Firestore', error);
      }
    };

    fetchUserProfile();
  }, [userId, db]);

  
  useEffect(() => {
    loadSelections();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      // Adicione verificações para garantir que todas as seleções foram feitas
      if (!selectedButtons.genero || !selectedButtons.criancas || !selectedButtons.moradia || !selectedButtons.espaco || !selectedButtons.possuiPets || !selectedButtons.horas) {
        Alert.alert('Por favor, preencha todas as seleções.');
        return;
      }
  
      // Adicione verificações para garantir que todos os campos obrigatórios foram preenchidos
      else if (!nome || !dataNascimento || !email || !celular || !cidade || !estado || !ocupacao || !numPessoas) {
        Alert.alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      } else {
        navigation.navigate('Home');
        Alert.alert('Perfil atualizado com sucesso!');
      }
  
      // Use o ID do documento recuperado da consulta
      const userDocRef = doc(db, 'PessoasFisicas', userId);
  
      const profileData = {};

      // Adicione as categorias selecionadas ao objeto profileData
      profileData.genero = selectedButtons.genero;
      profileData.criancas = selectedButtons.criancas;
      profileData.moradia = selectedButtons.moradia;
      profileData.espaco = selectedButtons.espaco;
      profileData.possuiPets = selectedButtons.possuiPets;
      profileData.horas = selectedButtons.horas;
      profileData.conheceuRedes = selectedButtons.conheceuRedes;
  
      // Adicione campos adicionais
      profileData.nome = nome;
      profileData.dataNascimento = dataNascimento;
      profileData.email = email;
      profileData.celular = celular;
      profileData.ocupacao = ocupacao;
      profileData.numPessoas = numPessoas;
  
      console.log('Atualizando perfil com os seguintes dados:', profileData);
  
      await updateDoc(userDocRef, profileData);
    } catch (error) {
      console.error('Erro ao atualizar o perfil do usuário', error);
      Alert.alert('Erro ao atualizar o perfil. Tente novamente mais tarde.');
    }
  };
  
  

  const handleGeneroChange = (femininoSelected, masculinoSelected) => {
    setGeneroFeminino(femininoSelected);
    setGeneroMasculino(masculinoSelected);
  };

  const handleCriancasChange = (simSelected, naoSelected) => {
    setCriancasSim(simSelected);
    setCriancasNao(naoSelected);
  };

  const handleMoradiaChange = (casaSelected, apartamentoSelected) => {
    setMoradiaCasa(casaSelected);
    setMoradiaApartamento(apartamentoSelected);
  };

  const handleEspacoChange = (pequenoSelected, medioSelected, grandeSelected) => {
    setEspacoPequeno(pequenoSelected);
    setEspacoMedio(medioSelected);
    setEspacoGrande(grandeSelected);
  };

  const handlePossuiPetsChange = (simSelected, naoSelected) => {
    setPossuiPetsSim(simSelected);
    setPossuiPetsNao(naoSelected);
  };

  const handleHorasChange = (menos4Selected, a8Selected, a12Selected, mais12Selected) => {
    setHoras4ouMenos(menos4Selected);
    setHoras4a8(a8Selected);
    setHoras8a12(a12Selected);
    setHoras12ouMais(mais12Selected);
  };

  const handleConheceuRedesChange = (rede) => {
    setConheceuRedes((prevState) => ({ ...prevState, [rede]: !prevState[rede] }));
  };

  const handleButtonPress = (category, buttonName) => {
    setSelectedButtons((prevButtons) => ({
      ...prevButtons,
      [category]: buttonName,
    }));

    switch (category){
      case 'feminino':
        handleGeneroChange(true, false);
        break;
      case 'masculino':
        handleGeneroChange(false, true);
        break;
      case 'criancasSim':
        handleCriancasChange(true, false);
        break;
      case 'criancasNao':
        handleCriancasChange(false, true);
        break;
      case 'moradiaCasa':
        handleMoradiaChange(true, false);
        break;
      case 'moradiaApartamento':
        handleMoradiaChange(false, true);
        break;
      case 'espacoPequeno':
        handleEspacoChange(true, false, false);
        break;
      case 'espacoMedio':
        handleEspacoChange(false, true, false);
        break;
      case 'espacoGrande':
        handleEspacoChange(false, false, true);
        break;
      case 'possuiPetsSim':
        handlePossuiPetsChange(true, false);
        break;
      case 'possuiPetsNao':
        handlePossuiPetsChange(false, true);
        break;
      case 'horas4ouMenos':
        handleHorasChange(true, false, false, false);
        break;
      case 'horas4a8':
        handleHorasChange(false, true, false, false);
        break;
      case 'horas8a12':
        handleHorasChange(false, false, true, false);
        break;
      case 'horas12ouMais':
        handleHorasChange(false, false, false, true);
        break;
      // Adicione outros casos conforme necessário
      default:
        break;
    }
     saveSelections();

};
  const renderButton = (category, buttonName, buttonText) => (
    <Pressable
      key={buttonName}
    
      onPress={() => {
        handleButtonPress(category, buttonName);

      }}   
      style={[
        styles.button,
        {
          backgroundColor:
            selectedButtons[category] === buttonName ? 'white' : '#2163D3',
          marginBottom: 10,
        },
      ]}
    >
      <Text style={{ color: selectedButtons[category] === buttonName ? '#FFAE2E' : 'white' }}>
        {buttonText}
      </Text>
    </Pressable>
  );
  

  return (
    <ScrollView>
        {isLoading ? ( // Mostra o indicador de carregamento enquanto isLoading é verdadeiro
        <ActivityIndicator size="large" color="#2163D3" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop:'60%' }} />
      ) : (
      <View style={styles.container}>
      <Text style={styles.title2}>DADOS PESSOAIS:</Text>
        <TextInput  style={styles.input} value={nome} onChangeText={setNome} placeholder="NOME"/>
        <TextInput style={styles.input}  value={dataNascimento} onChangeText={setDataNascimento} placeholder='XX/XX/XXXX' />
        <TextInput style={styles.input}  value={email} onChangeText={setEmail} placeholder='seunome@gmail.com' />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Entypo style={{marginLeft:20, position:'absolute'}} name="location" size={24} color="black" />
        <TextInput   style={styles.input}  value={cidade +","+ estado} onChangeText={setEndereco}/>
        </View>


                <Text style={styles.title}>Gênero</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('genero', 'feminino', 'Feminino')}
          {renderButton('genero', 'masculino', 'Masculino')}
        </View>

        <Text style={styles.title} >Há crianças em sua residência?</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('criancas', 'sim', 'Sim')}
          {renderButton('criancas', 'não', 'Não')}
        </View>

        <Text style={styles.title}>Você mora em:</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('moradia', 'casa', 'Casa')}
          {renderButton('moradia', 'apartamento', 'Apartamento')}
        </View>

        <Text style={styles.title}>Espaço de sua residência:</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('espaco', 'pequeno', 'Pequeno')}
          {renderButton('espaco', 'médio', 'Médio')}
          {renderButton('espaco', 'grande', 'Grande')}
        </View>

        <Text style={styles.title}>Você possui outros pets?</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('possuiPets', 'sim', 'Sim')}
          {renderButton('possuiPets', 'não', 'Não')}
        </View>

        <Text style={styles.title}>Quantas horas passa em casa por dia?</Text>
        <View style={{ flexDirection: 'row' }}>
          {renderButton('horas', '4 ou Menos', '4 ou menos')}
          {renderButton('horas', '4 a 8', '4 a 8 horas')}
          </View>
          <View style={{ flexDirection: 'row' }}>
          {renderButton('horas', '8 a 12', '8 a 12 horas')}
          {renderButton('horas', '12 ou Mais', '12 ou mais horas')}
        </View>
        <Text style={styles.title}>Sua ocupação</Text>
        <TextInput  style={styles.input} value={ocupacao} onChangeText={setOcupacao} />

        <Text style={styles.title}>Número de pessoas que moram com você</Text>
        <TextInput keyboardType='numeric' style={styles.input} value={numPessoas} onChangeText={setNumPessoas} />

        <View>
          <Text style={styles.title}>Whatsapp</Text>
          <Text style={styles.subtitle}>Pode fica tranquilo/a, suas informações não ficaram visíveis</Text>
          
          <View style={{ flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      margin: 5,}}>
        <FontAwesome   name="whatsapp" size={24} color="black" />
          <TextInput  style={styles.input} value={celular} onChangeText={setCelular} />
          </View>
          


        </View>

        <Text style={styles.title}>Como conheceu a gente?</Text>
        <View>
                {['instagram', 'facebook', 'twitter', 'outros'].map((buttonName) => (
          <Pressable
            key={buttonName}
            onPress={() => handleButtonPress('conheceuRedes', buttonName)}
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedButtons.conheceuRedes === buttonName ? 'white' : '#2163D3',
                marginBottom: 10,
              },
            ]}
          >
            <Text style={{ color: selectedButtons.conheceuRedes === buttonName ? '#2163D3' : 'white' }}>
              {buttonName.charAt(0).toUpperCase() + buttonName.slice(1)}
            </Text>
          </Pressable>
        ))}
        </View>

        <Pressable  onPress={() => {
                handleSaveProfile();
              }} style={{ alignItems: 'center',
              alignSelf:'center',
              backgroundColor: '#FFAE2E',
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              marginBottom:30,
              width:120,}}>
          <Text style={{ color: 'white' }}>Salvar Perfil</Text>
        </Pressable>
      </View>
      )}
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white', // Cor de fundo branca
    alignItems: 'center',
    justifyContent: 'center',

  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2163D3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    margin:5,
    width:120,
  },
  input:{
    height: 40,
    width:280,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    margin:15,
    textAlign:'center',
    flex: 1,
    marginLeft: 8, 
    color: '#000',
    backgroundColor: 'white',
    
  },
  title:{
    fontSize: 15,
    fontWeight: 'bold',
    margin:5,
  },
  title2:{
    fontSize: 22,
    fontWeight: 'bold',
    marginTop:45,
  },
  subtitle:{
    marginLeft:20,
    color:'darkgrey'

  }
};

export default ConfigPerfil;
