import React, { useState, useContext,useEffect   } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../Services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';


const itemStyles = [
  {borderColor: '#2163D3' },
  {borderColor: '#FFAE2E' }
]; // Cor das linhas(apenas decoração)

const PessoaFisicaCadastro = ({navigation},) => {
  const [nome, setNome] = useState('');
  const [cpf, setCPF] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [aceitarTermos, setAceitarTermos] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);


  const [senhaRequisitos, setSenhaRequisitos] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // Armazenando os dados de cadstro para posteriormente serem guardados no BD
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
  
  
  
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const validateFields = () => {
      if (
        nome &&
        isValidCPF(cpf) &&
        email &&
        celular &&
        cidade &&
        estado &&
        dataNascimento &&
        senha &&
        senha === confirmarSenha &&
        aceitarTermos
      ) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    };
  
    useEffect(() => {
      validateFields();
    }, [nome, cpf, email, celular, cidade, estado, senha, confirmarSenha, aceitarTermos, dataNascimento]);
  
  
    const isValidCPF = (cpf) => {
      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfPattern.test(cpf);
    };
    

    const handleDateChange = (text) => {
      const numericText = text.replace(/\D/g, '');
    
      if (numericText.length <= 2) {
        setDataNascimento(numericText);
      } else if (numericText.length <= 4) {
        setDataNascimento(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
      } else if (numericText.length <= 8) {
        setDataNascimento(`${numericText.slice(0, 2)}/${numericText.slice(2,4)}/${numericText.slice(4,8)}`);
        const day = numericText.slice(0, 2);
        const month = numericText.slice(2,4);
        const year = numericText.slice(4, 8);
    
        // Validar mês, dia e ano
        if (
          parseInt(month) <= 12 &&
          parseInt(day) <= 31 &&
          parseInt(year) >= 1 &&
          parseInt(year) <= 2005
        ) {
          setDataNascimento(`${day}/${month}/${year}`);
        }
        else{
          Alert.alert("COLOQUE UMA DATA DE NASCIMENTO VÁLIDA")
          setDataNascimento("");
        }
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
  
       
    
  const handleCPFChange = (text) => {
    const numericText = text.replace(/\D/g, ''); 
     if (numericText.length <= 3) {
      setCPF(numericText);
    } else if (numericText.length <= 6) {
      setCPF(`${numericText.slice(0, 3)}.${numericText.slice(3)}`);
    } else if (numericText.length <= 9) {
      setCPF(`${numericText.slice(0, 3)}.${numericText.slice(3, 6)}.${numericText.slice(6)}`);
    } else if (numericText.length <= 11) {
      setCPF(`${numericText.slice(0, 3)}.${numericText.slice(3, 6)}.${numericText.slice(6, 9)}-${numericText.slice(9)}`);
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
        const user = userCredential.user;
        const userUid = user.uid
        const userType = "user"
        console.log('Usuário criado:', user);
  
        // Crie um objeto com os dados do usuário
        const userData = {
          nome,
          cpf,
          email,
          celular,
          cidade,
          estado,
          dataNascimento,
          userUid,
          userType
        };
  
        // Obtenha uma referência à coleção "PessoasJuridicas"
        const pessoasFisicasRef = collection(firestore, 'PessoasFisicas');
  
        // Adicione os dados do usuário a um novo documento
        addDoc(pessoasFisicasRef, userData)
          .then((docRef) => {
            console.log('Dados do usuário adicionados ao Firestore com ID do documento: ', docRef.id);

          })
          
      })
   
    }
    else{
      Alert.alert("PREENCHA TODOS OS DADOS CORRETAMENTE")
    }
  };
  

  return (
    <ScrollView style={{backgroundColor:'#fff'}}>

  
    <View style={styles.container}>

      <Text style={styles.heading}>Cadastro Pessoa Física</Text>
      <TextInput
        style={[styles.input,itemStyles[0]]}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={[styles.input,itemStyles[1]]}
        inputMode='numeric'
        keyboardType='numeric'
        placeholder="CPF(XXX.XXX.XXX.XX)"
        value={cpf}
        onChangeText={handleCPFChange}
      />
      <TextInput
        style={[styles.input,itemStyles[0]]}
        inputMode='email'
        placeholder="Email"
        keyboardType='email-address'
        value={email}
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
        style={[styles.input,itemStyles[1]]}
        placeholder="Data de Nascimento(XX/XX/XXXX)"
        keyboardType='numeric'
        value={dataNascimento}
        onChangeText={handleDateChange}
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
          <Text style={{fontWeight:'bold', fontSize:12}}>{mostrarSenha ? 'Ocultar Senha' : 'Revelar Senha'}</Text>
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
        title="ACEITAR TERMOS E CONDIÇÕES"
        checked={aceitarTermos}
        onPress={handleCheckboxToggle}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxLabel}
        checkedColor="#2163D3"
        value={setAceitarTermos}
      
      /><Text style={{margin:8, color:"blue", fontWeight:'bold'}}  onPress={() => { 
        Linking.openURL('https://etecspgov-my.sharepoint.com/:w:/g/personal/jose_rubens_etec_sp_gov_br/Eaa2ArwIN-BAiuA1C94WC9oBf2tTuhQU2-cmRbYwmmQ1BA?e=qnUcC4'); 
      }}>TERMOS E CONDIÇÕES</Text>
      <Pressable style={styles.button}   onPress={() => {
            handleCad();
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
    margin:'20%'

  },
  revealButton: {
    alignSelf: 'flex-end',
    marginRight: 0,
    marginTop: -36,
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
    alignSelf:'center',
    width:100,
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
});

export default PessoaFisicaCadastro;
