import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; //conexão com o banco de dados
import { getAuth } from 'firebase/auth'; //conexão com o autenticador

const firebaseConfig = {
    apiKey: "AIzaSyCDyjfwfiK-m4Z2ycmGqtLyvmyNA73rF3c",
    authDomain: "teste-curso-2443b.firebaseapp.com",
    projectId: "teste-curso-2443b",
    storageBucket: "teste-curso-2443b.firebasestorage.app",
    messagingSenderId: "1058615848277",
    appId: "1:1058615848277:web:b0cddb152cf2604963d3dc",
    measurementId: "G-G4ZL3TM4FE"
  };

  const firebaseApp = initializeApp(firebaseConfig); //inicializando firebase

  const db = getFirestore(firebaseApp); //inicializando a conexão com o banco passando a configuração do nosso Firebase

  const auth = getAuth(firebaseApp); //inicialando a conexão com o autenticador do nosso Firebase

  export { db, auth }; //exportando o banco e o autenticador para ser utilizado em outros arquivos