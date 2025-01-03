import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';import { Ionicons } from '@expo/vector-icons';

const TelaAdocao = ({ route, navigation }) => {
  const { animalId } = route.params;
    const db = getFirestore();
    const auth = getAuth();

  const [nome, setNome] = useState(''); 
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [horas, setHoras] = useState('');
  const [espaco, setEspaco] = useState('');
  const [criancas, setCriancas] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [numPessoas, setNumPessoas] = useState('');
  const [possuiPets, setPossuiPets] = useState('');
  const [moradia, setMoradia] = useState('');
  const [aceitarTermos, setAceitarTermos] = useState(false);

  const [motivoAdocao, setMotivoAdocao] = useState('');
  const [userId, setUserId] = useState('');

  const handleCheckboxToggle = () => {
    setAceitarTermos(!aceitarTermos);
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
          const userData = userDocSnapshot.data();
          setUserId(userDocSnapshot.id); // Defina o ID do documento

          // Restante do seu código...
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
          setEmail(userData.email);
          setCelular(userData.celular);
          setCriancas(userData.criancas);
          setEspaco(userData.espaco);
          setHoras(userData.horas);
          setNumPessoas(userData.numPessoas);
          setMoradia(userData.moradia);
          setOcupacao(userData.ocupacao);
          setPossuiPets(userData.possuiPets);

                } else {
          console.warn('Documento do usuário não encontrado no Firestore');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário no Firestore', error);
      }
    };

    fetchUserProfile();
  }, [userId, db]);
  const handleOpenTermoResponsabilidade = () => {
    // Substitua pela URL ou caminho do arquivo do termo de responsabilidade
    const termoResponsabilidadeURL = 'https://etecspgov-my.sharepoint.com/:w:/g/personal/jose_rubens_etec_sp_gov_br/EbKoG4D0mlNPtb06MORl1OIB7qYh-HQgXShNMUPKX7mWog?e=v63ojr';
    Linking.openURL(termoResponsabilidadeURL);
  };

  const handleIniciarAdocao = async () => {
    try {
      if (motivoAdocao === "" || !aceitarTermos) {
        Alert.alert("Preencha o motivo da adoção e aceite os termos para prosseguir.");
        return; // Interrompe a execução da função se os requisitos não forem atendidos
      }
      
      
      // Obtendo o documento do animal
      const animalDocRef = doc(db, 'Animais', animalId);
      const animalDocSnap = await getDoc(animalDocRef);
  
      if (animalDocSnap.exists()) {
        const animalData = animalDocSnap.data();
  
        // Obtendo o userId do dono do animal
        const userIdDono = animalData.userId;
  
        // Query para buscar o dono usando o campo userId
        
        const pessoasFisicasRef = collection(db, 'PessoasFisicas');
        const pessoasJuridicasRef = collection(db, 'PessoasJuridicas');

        const qFisicas = query(pessoasFisicasRef, where('userUid', '==', userIdDono));
        const qJuridicas = query(pessoasJuridicasRef, where('userUid', '==', userIdDono));

          const querySnapshotFisicas = await getDocs(qFisicas);
          const querySnapshotJuridicas = await getDocs(qJuridicas);

  
        if (!querySnapshotFisicas.empty) {
          // Assumindo que há apenas um dono com o mesmo userId
          const donoDocSnap = querySnapshotFisicas.docs[0];
          const donoData = donoDocSnap.data();
          const celularDono = donoData.celular;
  
          // Agora você tem o celular do dono e pode usar conforme necessário
          const mensagem = `https://api.whatsapp.com/send?phone=+55${celularDono}&text=Ola sou o ${nome} vi seu pet no Vira-lar estou interessado aqui estão algumas informações sobre mim, moro em ${moradia}, de tamanho ${espaco}, ${criancas} possuo crianças em casa, passo ${horas} horas em casa, comigo moram ${numPessoas} pessoas, ${possuiPets} possuo outros pets e minha ocupação é ${ocupacao}.

*Aqui está o documento que devemos assinar para concretizar esta adoção:* https://drive.google.com/file/d/1OyKnTEXPmKcUpb_WndFN_GPMIjqyG-uV/view?usp=sharing`;
          Linking.openURL(mensagem);

        } 
        if(!querySnapshotJuridicas.empty ){
            const donoDocSnap = querySnapshotJuridicas.docs[0];
            const donoData = donoDocSnap.data();
            const celularDono = donoData.celular;
    
            // Agora você tem o celular do dono e pode usar conforme necessário
            const mensagem = `https://api.whatsapp.com/send?phone=+55${celularDono}&text=Ola sou o ${nome} vi seu pet no Vira-lar estou interessado aqui estão algumas informações sobre mim, moro em ${moradia}, de tamanho ${espaco}, ${criancas} possuo crianças em casa, passo ${horas} horas em casa, comigo moram ${numPessoas} pessoas, ${possuiPets} possuo outros pets e minha ocupação é ${ocupacao}.
          
*Aqui está o documento que devemos assinar para concretizar esta adoção:* https://drive.google.com/file/d/1OyKnTEXPmKcUpb_WndFN_GPMIjqyG-uV/view?usp=sharing`;
              Linking.openURL(mensagem);

        }else {
          console.warn('Documento do dono não encontrado');
        }
      } else {
        console.warn('Documento do animal não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar informações do animal e do dono no Firestore', error);
    }
  
  };
  
  

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="ios-arrow-back-sharp" size={25} color="#FFAE2E" />
      </Pressable>
      <Text style={styles.title}>Formulário de Adoção</Text>

      <View style={styles.userInfo}>
        <TextInput style={styles.input} placeholder="Nome" value={nome} editable={false} />
        <TextInput style={styles.input} placeholder="Email" value={email} editable={false} />
        <TextInput style={styles.input} placeholder="Telefone" value={celular} editable={false} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Motivo da Adoção"
        multiline
        numberOfLines={4}
        value={motivoAdocao}
        onChangeText={(text) => setMotivoAdocao(text)}
      />
   <Text>
    Para que seja necessário continuar o processo de adoção, será essencial assinar um termo de responsabilidade por parte do doador e do adotante sobre o animal adotado. Imprima e tenhas em mãos o seguinte termo:</Text>
      <Pressable style={styles.termoResponsabilidade} onPress={handleOpenTermoResponsabilidade}>
        <Text style={styles.termoResponsabilidadeText}>Termo de Responsabilidade</Text>
      </Pressable>

      <Text style={styles.infoText}>
        Essas informações ajudam o abrigo ou a organização de adoção a encontrar o melhor lar possível para o animal.
        O objetivo é assegurar que a adoção seja uma experiência positiva tanto para o animal quanto para o novo dono.
      </Text>
      <CheckBox
        title="ACEITAR POLITICAS DE PRIVACIDADE E TERMOS DE USO"
        checked={aceitarTermos}
        onPress={handleCheckboxToggle}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxLabel}
        checkedColor="#2163D3"
        value={setAceitarTermos}
      
      /><Text style={{margin:8, color:"blue", fontWeight:'bold'}}  onPress={() => { 
        Linking.openURL('https://etecspgov-my.sharepoint.com/:w:/g/personal/jose_rubens_etec_sp_gov_br/Eaa2ArwIN-BAiuA1C94WC9oBf2tTuhQU2-cmRbYwmmQ1BA?e=qnUcC4'); 
      }}>POLITICAS DE PRIVACIDADE E TERMOS DE USO</Text>
      <Pressable style={styles.iniciarAdocaoButton} onPress={handleIniciarAdocao}>
        <Text style={styles.iniciarAdocaoButtonText}>Começar Processo de Adoção</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#fff'
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2163D3',
    padding: 7,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 25,
    marginRight: 20,
    width: 40,
    height: 40,
  },
  userInfo: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  termoResponsabilidade: {
    backgroundColor: '#2163D3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  termoResponsabilidadeText: {
    color: 'white',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
  iniciarAdocaoButton: {
    backgroundColor: '#2163D3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  iniciarAdocaoButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TelaAdocao;
