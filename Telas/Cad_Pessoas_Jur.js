  import React, { useState,useContext,useEffect   } from 'react';
  import { View, Text, TextInput, Pressable, StyleSheet, ScrollView} from 'react-native';
  import { Alert } from 'react-native';
  import {  CheckBox } from 'react-native-elements';  
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth, firestore } from '../Services/firebaseConfig';
  import { collection, addDoc } from 'firebase/firestore';
  import { signOut } from 'firebase/auth';


  const itemStyles = [
    {borderColor: '#2163D3' },
    {borderColor: '#FFAE2E' }
  ]; // Cor das linhas(apenas decoração)

  
  const PessoaJuridicaCadastro = ({navigation}) => {
    const [nome, setNome] = useState('');
    const [cnpj, setCNPJ] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [aceitarTermos, setAceitarTermos] = useState(false);
    // Armazenando os dados de cadstro para posteriormente serem guardados no BD
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [senhaRequisitos, setSenhaRequisitos] = useState({
      minLength: false,
      uppercase: false,
      lowercase: false,
      number: false,
    });
  

    const validateFields = () => {
      if (
        nome &&
        isValidCNPJ(cnpj) &&
        email &&
        celular &&
        cidade &&
        estado &&
        senha &&
        senha === confirmarSenha &&
        aceitarTermos
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    };
    const checkSenhaRequisitos = (text) => {
      const hasUppercase = /[A-Z]/.test(text);
      const hasLowercase = /[a-z]/.test(text);
      const hasNumber = /\d/.test(text);
      const hasMinLength = text.length >= 8;
  
      setSenhaRequisitos({
        minLength: hasMinLength,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        number: hasNumber,
      });
    };
    
    const handleSenhaChange = (text) => {
      setSenha(text);
      checkSenhaRequisitos(text);
    };
  
    useEffect(() => {
      validateFields();
    }, [nome, cnpj, email, celular, cidade, estado, senha, confirmarSenha, aceitarTermos]);
  
  
    const isValidCNPJ = (cnpj) => {
      // Expressão regular para validar CNPJ
      const cnpjPattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      return cnpjPattern.test(cnpj);
    };

    const handleCelularChange = (text) => {
      const numericText = text.replace(/\D/g, '');
    
      if (numericText.length <= 2) {
        // Mantém o formato inicial
        setCelular(numericText);
      } else if (numericText.length <= 11) {
        const ddd = numericText.slice(0, 2);
        const rest = numericText.slice(2);
    
        if (rest.length >= 9) {
          // Se houver 9 dígitos ou mais após o DDD, inclui o "9"
          setCelular(`(${ddd})${rest.slice(0, 5)}-${rest.slice(5)}`);
        } else {
          // Se não, mantém o formato padrão
          setCelular(`(${ddd})${rest}`);
        }
      }
    };
    
    const handleCNPJChange = (text) => {
      const numericText = text.replace(/\D/g, ''); // Remover caracteres não numéricos

      if (numericText.length <= 2) {
        setCNPJ(numericText);
      } else if (numericText.length <= 5) {
        setCNPJ(`${numericText.slice(0, 2)}.${numericText.slice(2)}`);
      } else if (numericText.length <= 8) {
        setCNPJ(`${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5)}`);
      } else if (numericText.length <= 12) {
        setCNPJ(`${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8)}`);
      } else if (numericText.length <= 14) {
        setCNPJ(`${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8, 12)}-${numericText.slice(12)}`);
      }
    };
      // Formatando o formato do dado CPF


    const handleCheckboxToggle = () => {
      setAceitarTermos(!aceitarTermos);
      
    };


    const handleCad = () => {
      if (!isButtonDisabled) {
        navigation.navigate('Login');

      // Crie o usuário com o email e senha fornecidos
      createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
          const userJur = userCredential.user;
          const userUid = userJur.uid;
          const userType = "userJur"

          console.log('Usuário criado:', userJur);
    
          // Crie um objeto com os dados do usuário
          const userData = {
            nome,
            cnpj,
            email,
            celular,
            cidade,
            estado,
            userUid,
            userType
          };
    
          // Obtenha uma referência à coleção "PessoasJuridicas"
          const pessoasJuridicasRef = collection(firestore, 'PessoasJuridicas');
    
          // Adicione os dados do usuário a um novo documento
          addDoc(pessoasJuridicasRef, userData)
            .then((docRef) => {
              console.log('Dados do usuário adicionados ao Firestore com ID do documento: ', docRef.id);          
               
            })
            
        })
        
  
      } else {

        Alert.alert("PREENCHA TODOS OS DADOS CORRETAMENTE")

        }
    };
    



    return (
      <ScrollView style={{backgroundColor:'#fff'}}>
        
      <View style={styles.container}>

        <Text style={styles.heading}>Cadastro Pessoa Jurídica</Text>
        <TextInput
          style={[styles.input,itemStyles[0]]}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input,itemStyles[1]]}
          placeholder="CNPJ"
          keyboardType='numeric'
          value={cnpj} 
          onChangeText={handleCNPJChange}     />
        <TextInput
          style={[styles.input,itemStyles[0]]}
          placeholder="Email"
          value={email}
          keyboardType='email-address'
          onChangeText={setEmail}
        />
     <TextInput
        style={[styles.input,itemStyles[1]]}
        placeholder="DDD+CELULAR(WHATSAPP)"
        value={celular}
        keyboardType='numeric'
        onChangeText={handleCelularChange}
      />
  
        <TextInput
          style={[styles.input,itemStyles[0]]}
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        <TextInput
          style={[styles.input,itemStyles[1]]}
          placeholder="Estado"
          value={estado}
          onChangeText={setEstado}
        />
        <TextInput
        style={[styles.input, itemStyles[0], senhaRequisitos.minLength && { color: 'green' }]}
        placeholder="Senha"
        secureTextEntry={!mostrarSenha}
        value={senha}
        onChangeText={handleSenhaChange}
      />
        <Pressable
          style={styles.revealButton}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <Text style={{fontWeight:'bold',fontSize:12}}>{mostrarSenha ? 'Ocultar Senha' : 'Revelar Senha'}</Text>
        </Pressable>
      <Text style={styles.requisitosSenha}>
        - 8 caracteres {senhaRequisitos.minLength && <Text style={{ color: 'green' }}>✓</Text>}
        {'\n'}- letra maiúscula {senhaRequisitos.uppercase && <Text style={{ color: 'green' }}>✓</Text>}
        {'\n'}- letra minúscula {senhaRequisitos.lowercase && <Text style={{ color: 'green' }}>✓</Text>}
        {'\n'}- número {senhaRequisitos.number && <Text style={{ color: 'green' }}>✓</Text>}
      </Text>
        <TextInput
          style={[styles.input,itemStyles[1]]}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
      
        <CheckBox
          title="ACEITAR TERMOS DE CONDIÇÕES"
          checked={aceitarTermos}
          onPress={() => {
            handleCheckboxToggle();
          }}
          containerStyle={styles.checkboxContainer}
          textStyle={styles.checkboxLabel}
          checkedColor="#2163D3"
          value={setAceitarTermos}
        />
        <Text style={{margin:8, color:"blue", fontWeight:'bold'}}  onPress={() => { 
        Linking.openURL('https://etecspgov-my.sharepoint.com/:w:/g/personal/jose_rubens_etec_sp_gov_br/Eaa2ArwIN-BAiuA1C94WC9oBf2tTuhQU2-cmRbYwmmQ1BA?e=qnUcC4'); 
      }}>TERMOS E CONDIÇÕES</Text>
        <Pressable style={styles.button}  onPress={() =>  {{} handleCad();
            }}   >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </Pressable>

      </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', // Cor de fundo branca
      alignItems: 'center',
      justifyContent: 'center',
      margin:'25%'

    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 40,
      width:280,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#2163D3',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      width:150,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },

  picker: {
    height: 40,
    width:280,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  requisitosSenha: {
    color: 'gray',
    fontSize: 12,
    margin: 20,
  },
  revealButton: {
    alignSelf: 'flex-end',
    marginRight: -20,
    marginTop: -36,
  },
  });

  export default PessoaJuridicaCadastro;
