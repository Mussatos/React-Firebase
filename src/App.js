import { db, auth } from './firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import './app.css';
import { useState, useEffect } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

//export default nao precisa vir dentro de chaves { exemplo }
//ja o export sem ser default precisa vir dentro de chaves, igual ta ali em cima

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);


  async function handleAdd() {

    await addDoc(collection(db, 'posts'), { // addDoc cria automaticamente um ID unico no banco
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Dados registrados no banco!");
        setAutor('');
        setTitulo('');
      })
      .catch((err) => {
        console.log("Erro: " + err);
      })


    //  await setDoc(doc(db, 'posts', '12345'), { //setDoc você precisa especificar o ID do seu banco
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(()=>{
    //   console.log("Dados registrados no banco!");
    // })
    // .catch((err)=>{
    //   console.log("Erro: "+err);
    // })

  }

  useEffect(() => {
    async function loadPosts() {
      //onSnapshot fica verificando o banco em real time, e quando ocorre qualquer mudança ele atualiza e joga na tela (com base na lógica da função)
      const onsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(listaPost);
      })
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // se tem usuário logado ele vai cair aqui
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          })
        }
        else {
          // nao possui nenhum user logado
          setUser(false);
          setUserDetail({});
        }
      })
    }
    checkLogin();
  }, []);

  async function buscarPost() {
    //   const postRef = doc(db, 'posts', '12345')

    //   await getDoc(postRef) //getDoc -> utilizado para procurar 1 post (singular)
    //   .then((snapshot)=>{
    //     setAutor(snapshot.data().autor)
    //     setTitulo(snapshot.data().titulo)

    //   })
    //   .catch((err)=>{
    //     console.log("Erro: "+err);
    //   })
    // 

    const postsRef = collection(db, 'posts')

    await getDocs(postsRef) //getDocs -> utilizado para procurar todos os posts (plural)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);

      })
      .catch((err) => {
        console.log(err);
      })
  }

  async function editarPost() {
    const docRef = doc(db, 'posts', idPost)

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO!");
        setIdPost('');
        setAutor('');
        setTitulo('');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  async function excluirPost(id) {
    alert('POST DELETADO COM SUCESSO!')
    const docRef = doc(db, 'posts', id)

    await deleteDoc(docRef)
      .then(() => {
        console.log("POST DELETADO COM SUCESSO!");
      })
      .catch((err) => {
        console.log(err);
      })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Cadastrado com sucesso!');
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        if (err.code === 'auth/weak-password') {
          alert("Senha muito fraca!")
        } else if (err.code === 'auth/email-already-in-use') {
          alert("Email já existe!")
        }
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        alert("Usuário logado com sucesso!");

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,

        })

        setUser(true);

        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        alert(err);
      })
  }

  async function fazerLogout() {
    await signOut(auth)
      .then(() => {
        alert("Deslogado com sucesso!");
        setUser(false);
        setUserDetail({});
      })
      .catch((err) => {
        alert(err);
      })
  }

  return (
    <div>

      <h1>ReactJS + Firebase</h1>

      {user && (
        <div className='logado'>
          <strong>
            Seja bem-vindo(a)!
            <br />
            Você está logado!
          </strong> <br />
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
          <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
        </div>
      )}

      <div className='container'>

        <h2>Usuários</h2>

        <label>
          Email:
        </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Digite um email' /> <br />

        <label>
          Senha:
        </label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Digite uma senha' /> <br />

        <button onClick={novoUsuario}>Cadastrar</button> <br />
        <button onClick={logarUsuario}>Login</button> <br />

      </div>
      <br /> <br />

      <hr />
      {
        user && (
          <div className='container'>
            <h2>Posts</h2>

            <label>
              ID do Post:
            </label>
            <input placeholder='Digite o ID do post' value={idPost} onChange={(e) => setIdPost(e.target.value)} />
            <br />
            <label>
              Titulo:
            </label>
            <textarea placeholder='Digite o titulo' type='text' value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <br />
            <label>
              Autor:
            </label>
            <input type='text' placeholder='Autor do post' value={autor} onChange={(e) => setAutor(e.target.value)} />
            <br />
            <button type='button' onClick={handleAdd}>Cadastrar</button>
            <br />
            <button onClick={buscarPost}>Buscar post</button>
            <br />
            <button onClick={editarPost}>Atualizar post</button>

            <ul>{posts.map((post) => {
              return (

                <li key={post.id}>
                  <strong>
                    ID: {post.id}
                  </strong>
                  <br />
                  <span>
                    Titulo: {post.titulo}
                  </span>
                  <br />
                  <span>
                    Autor: {post.autor}
                  </span>
                  <br />
                  <button onClick={() => excluirPost(post.id)}>Excluir</button>
                  <br />
                  <br />

                </li>
              );
            })}</ul>
          </div>
        )
      }
    </div>
  );
}

export default App;
