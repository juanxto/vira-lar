import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function PosAdd({ navigation }) {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Usuário autenticado:', user);

        const pessoasFisicasRef = collection(db, 'PessoasFisicas');
        const pessoasJuridicasRef = collection(db, 'PessoasJuridicas');

        const qFisicas = query(pessoasFisicasRef, where('userUid', '==', user.uid));
        const qJuridicas = query(pessoasJuridicasRef, where('userUid', '==', user.uid));

        try {
          const querySnapshotFisicas = await getDocs(qFisicas);
          const querySnapshotJuridicas = await getDocs(qJuridicas);

          if (!querySnapshotFisicas.empty) {
            const userDocSnapshot = querySnapshotFisicas.docs[0];
            const userData = userDocSnapshot.data();
            setUserType(userData.userType);
          } else if (!querySnapshotJuridicas.empty) {
            const userDocSnapshot = querySnapshotJuridicas.docs[0];
            const userData = userDocSnapshot.data();
            setUserType(userData.userType);
          } else {
            console.log('Documento do usuário não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar informações do usuário no Firestore', error);
        }
      } else {
        console.log('Usuário não está autenticado');
      }
    });

    // Certifique-se de cancelar a assinatura quando o componente for desmontado
    return () => unsubscribe();
  }, []);


  const handleRefresh = () => {
    if (userType === 'user') {
      navigation.navigate('Home');
    } else if (userType === 'userJur') {
      navigation.navigate('HomeJur');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Image source={require('../imgs/logo_Inicio.png')} style={styles.image} />
        <Text style={styles.text}>Tudo pronto!</Text>
        <Text style={{color:'black'}}>Agora só esperar a família perfeita escolher o animalzinho!</Text>

      </View>
      <TouchableOpacity onPress={handleRefresh} style={{ backgroundColor: '#2163D3',
    borderRadius: 10,
    alignItems: 'center',
    margin:'10%', 
    width:180,
    height: 50,
    borderColor: 'darkblue',
    borderBottomWidth: 5,
    justifyContent:'center',}}>
        <Text>Voltar para a Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
});
