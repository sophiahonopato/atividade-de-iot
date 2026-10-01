// ============================================================
// Minhas Tarefas — HTML, CSS, JavaScript puro + Firebase
// Serviços: Authentication (e-mail/senha) + Cloud Firestore
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBzlaJK0InIXb4m568rsBlbS1H_xMHNmtE",
  authDomain: "sophia-f562d.firebaseapp.com",
  projectId: "sophia-f562d",
  storageBucket: "sophia-f562d.firebasestorage.app",
  messagingSenderId: "380542794359",
  appId: "1:380542794359:web:4a71fcf1430bcef5bb2472"
};


// ============================================================
// INICIALIZAÇÃO
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const $ = (id) => document.getElementById(id);

const telaCarregando = $("tela-carregando");
const telaAuth = $("tela-auth");
const telaApp = $("tela-app");

const abaLogin = $("aba-login");
const abaCadastro = $("aba-cadastro");

const formAuth = $("form-auth");

const inputEmail = $("email");
const inputSenha = $("senha");

const msgAuth = $("msg-auth");

const btnAuth = $("btn-auth");
const btnEsqueci = $("btn-esqueci");

const usuarioEmail = $("usuario-email");
const btnSair = $("btn-sair");

const formTarefa = $("form-tarefa");
const inputNovaTarefa = $("nova-tarefa");

const lista = $("lista-tarefas");
const listaVazia = $("lista-vazia");

const progressoTexto = $("progresso-texto");
const barraPreenchida = $("barra-preenchida");

const botoesFiltro = document.querySelectorAll(".filtro");


// ============================================================
// ESTADO DA APLICAÇÃO
// ============================================================

let modoCadastro = false;

let usuarioAtual = null;

let pararDeOuvir = null;

let tarefas = [];

let filtroAtual = "todas";

let editandoId = null;


// ============================================================
// AUTENTICAÇÃO
// ============================================================

function trocarModo(cadastro) {

  modoCadastro = cadastro;

  abaLogin.classList.toggle(
    "ativa",
    !cadastro
  );

  abaCadastro.classList.toggle(
    "ativa",
    cadastro
  );

  abaLogin.setAttribute(
    "aria-selected",
    String(!cadastro)
  );

  abaCadastro.setAttribute(
    "aria-selected",
    String(cadastro)
  );

  btnAuth.textContent = cadastro
    ? "Criar conta"
    : "Entrar";

  inputSenha.autocomplete = cadastro
    ? "new-password"
    : "current-password";

  btnEsqueci.hidden = cadastro;

  mostrarMensagem("");
}


// ============================================================
// TROCA ENTRE LOGIN E CADASTRO
// ============================================================

abaLogin.addEventListener(
  "click",
  () => trocarModo(false)
);

abaCadastro.addEventListener(
  "click",
  () => trocarModo(true)
);


// ============================================================
// MENSAGENS
// ============================================================

function mostrarMensagem(
  texto,
  sucesso = false
) {

  msgAuth.textContent = texto;

  msgAuth.classList.toggle(
    "sucesso",
    sucesso
  );
}


// ============================================================
// TRADUÇÃO DOS ERROS DO FIREBASE
// ============================================================

function traduzirErro(codigo) {

  const erros = {

    "auth/invalid-email":
      "E-mail inválido. Confira o formato.",

    "auth/missing-password":
      "Digite sua senha.",

    "auth/weak-password":
      "A senha precisa ter pelo menos 6 caracteres.",

    "auth/email-already-in-use":
      "Este e-mail já tem conta. Use a aba Entrar.",

    "auth/invalid-credential":
      "E-mail ou senha incorretos.",

    "auth/user-not-found":
      "Não existe conta com este e-mail.",

    "auth/wrong-password":
      "Senha incorreta.",

    "auth/too-many-requests":
      "Muitas tentativas. Aguarde alguns minutos e tente novamente.",

    "auth/network-request-failed":
      "Sem conexão com a internet.",

    "auth/api-key-not-valid":
      "A configuração do Firebase está inválida.",

    "auth/operation-not-allowed":
      "O login por e-mail e senha não está ativado no Firebase.",

    "permission-denied":
      "Você não tem permissão para acessar esses dados."

  };

  return (
    erros[codigo] ||
    `Algo deu errado (${codigo || "erro desconhecido"}).`
  );
}


// ============================================================
// CADASTRO E LOGIN
// ============================================================

formAuth.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const email =
      inputEmail.value.trim();

    const senha =
      inputSenha.value;


    if (!email) {

      mostrarMensagem(
        "Digite seu e-mail."
      );

      inputEmail.focus();

      return;
    }


    if (!senha) {

      mostrarMensagem(
        "Digite sua senha."
      );

      inputSenha.focus();

      return;
    }


    btnAuth.disabled = true;

    mostrarMensagem("");


    try {

      if (modoCadastro) {

        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );

      }

      formAuth.reset();

    } catch (erro) {

      console.error(
        "Erro de autenticação:",
        erro
      );

      mostrarMensagem(
        traduzirErro(erro.code)
      );

    } finally {

      btnAuth.disabled = false;

    }

  }
);


// ============================================================
// RECUPERAÇÃO DE SENHA
// ============================================================

btnEsqueci.addEventListener(
  "click",
  async () => {

    const email =
      inputEmail.value.trim();


    if (!email) {

      mostrarMensagem(
        "Digite seu e-mail acima e clique em Esqueci minha senha."
      );

      inputEmail.focus();

      return;
    }


    try {

      await sendPasswordResetEmail(
        auth,
        email
      );

      mostrarMensagem(
        `Enviamos um link de redefinição para ${email}.`,
        true
      );

    } catch (erro) {

      console.error(
        "Erro ao recuperar senha:",
        erro
      );

      mostrarMensagem(
        traduzirErro(erro.code)
      );

    }

  }
);


// ============================================================
// LOGOUT
// ============================================================

btnSair.addEventListener(
  "click",
  async () => {

    try {

      await signOut(auth);

    } catch (erro) {

      console.error(
        "Erro ao sair:",
        erro
      );

    }

  }
);


// ============================================================
// ESTADO DO LOGIN
// ============================================================

onAuthStateChanged(
  auth,
  (usuario) => {

    telaCarregando.hidden = true;

    usuarioAtual = usuario;


    if (usuario) {

      telaAuth.hidden = true;

      telaApp.hidden = false;

      usuarioEmail.textContent =
        usuario.email || "";

      ouvirTarefas(
        usuario.uid
      );

      inputNovaTarefa.focus();

    } else {

      if (pararDeOuvir) {

        pararDeOuvir();

        pararDeOuvir = null;

      }

      tarefas = [];

      lista.innerHTML = "";

      telaApp.hidden = true;

      telaAuth.hidden = false;

      renderizar();

    }

  }
);


// ============================================================
// FIRESTORE
// ============================================================
//
// Estrutura:
//
// usuarios
//   └── UID_DO_USUARIO
//       └── tarefas
//           └── ID_DA_TAREFA
//
// Cada tarefa:
//
// {
//   titulo: string,
//   concluida: boolean,
//   criadoEm: timestamp
// }
//
// ============================================================


function colecaoTarefas(uid) {

  return collection(
    db,
    "usuarios",
    uid,
    "tarefas"
  );

}


// ============================================================
// LER TAREFAS EM TEMPO REAL
// ============================================================

function ouvirTarefas(uid) {

  if (pararDeOuvir) {

    pararDeOuvir();

    pararDeOuvir = null;

  }


  const q = query(
    colecaoTarefas(uid),
    orderBy(
      "criadoEm",
      "desc"
    )
  );


  pararDeOuvir = onSnapshot(

    q,

    (snapshot) => {

      tarefas =
        snapshot.docs.map(
          (documento) => ({

            id: documento.id,

            ...documento.data()

          })
        );


      renderizar();

    },

    (erro) => {

      console.error(
        "Erro ao ler tarefas:",
        erro
      );


      if (
        erro.code ===
        "permission-denied"
      ) {

        alert(
          "Não foi possível carregar as tarefas. Verifique as regras do Firestore."
        );

      } else {

        alert(
          "Não foi possível carregar as tarefas. Verifique sua conexão e a configuração do Firebase."
        );

      }

    }

  );

}


// ============================================================
// CRIAR TAREFA
// ============================================================

formTarefa.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const titulo =
      inputNovaTarefa.value.trim();


    if (
      !titulo ||
      !usuarioAtual
    ) {

      return;

    }


    inputNovaTarefa.value = "";


    try {

      await addDoc(

        colecaoTarefas(
          usuarioAtual.uid
        ),

        {

          titulo,

          concluida: false,

          criadoEm:
            serverTimestamp()

        }

      );

    } catch (erro) {

      console.error(
        "Erro ao salvar tarefa:",
        erro
      );


      alert(
        "Não foi possível salvar a tarefa. Verifique as regras do Firestore."
      );


      inputNovaTarefa.value =
        titulo;

    }

  }
);


// ============================================================
// MARCAR / DESMARCAR COMO CONCLUÍDA
// ============================================================

async function alternarConcluida(
  tarefa
) {

  if (!usuarioAtual) {

    return;

  }


  try {

    await updateDoc(

      doc(
        db,
        "usuarios",
        usuarioAtual.uid,
        "tarefas",
        tarefa.id
      ),

      {

        concluida:
          !tarefa.concluida

      }

    );

  } catch (erro) {

    console.error(
      "Erro ao atualizar tarefa:",
      erro
    );


    alert(
      "Não foi possível atualizar a tarefa."
    );

  }

}


// ============================================================
// EDITAR TÍTULO
// ============================================================

async function salvarTitulo(
  id,
  novoTitulo
) {

  const titulo =
    novoTitulo.trim();


  editandoId = null;


  if (!titulo) {

    renderizar();

    return;

  }


  if (!usuarioAtual) {

    return;

  }


  try {

    await updateDoc(

      doc(
        db,
        "usuarios",
        usuarioAtual.uid,
        "tarefas",
        id
      ),

      {

        titulo

      }

    );

  } catch (erro) {

    console.error(
      "Erro ao editar tarefa:",
      erro
    );


    alert(
      "Não foi possível editar a tarefa."
    );

  }

}


// ============================================================
// EXCLUIR TAREFA
// ============================================================

async function excluirTarefa(
  tarefa
) {

  if (!usuarioAtual) {

    return;

  }


  const confirmou =
    confirm(
      `Excluir a tarefa "${tarefa.titulo}"?`
    );


  if (!confirmou) {

    return;

  }


  try {

    await deleteDoc(

      doc(
        db,
        "usuarios",
        usuarioAtual.uid,
        "tarefas",
        tarefa.id
      )

    );

  } catch (erro) {

    console.error(
      "Erro ao excluir tarefa:",
      erro
    );


    alert(
      "Não foi possível excluir a tarefa."
    );

  }

}


// ============================================================
// FILTROS
// ============================================================

botoesFiltro.forEach(
  (botao) => {

    botao.addEventListener(
      "click",
      () => {

        filtroAtual =
          botao.dataset.filtro ||
          "todas";


        botoesFiltro.forEach(
          (b) => {

            b.classList.toggle(
              "ativo",
              b === botao
            );

          }
        );


        renderizar();

      }
    );

  }
);


// ============================================================
// RENDERIZAÇÃO
// ============================================================

function renderizar() {

  const total =
    tarefas.length;


  const feitas =
    tarefas.filter(
      (tarefa) =>
        tarefa.concluida
    ).length;


  progressoTexto.textContent =
    `${feitas} de ${total}` +
    (
      total === 1
        ? " concluída"
        : " concluídas"
    );


  barraPreenchida.style.width =
    total > 0
      ? `${(feitas / total) * 100}%`
      : "0%";


  const visiveis =
    tarefas.filter(
      (tarefa) => {

        if (
          filtroAtual ===
          "pendentes"
        ) {

          return !tarefa.concluida;

        }


        if (
          filtroAtual ===
          "concluidas"
        ) {

          return tarefa.concluida;

        }


        return true;

      }
    );


  lista.innerHTML = "";


  listaVazia.hidden =
    visiveis.length > 0;


  visiveis.forEach(
    (tarefa) => {

      const li =
        document.createElement(
          "li"
        );


      li.className =
        "tarefa" +
        (
          tarefa.concluida
            ? " feita"
            : ""
        );


      // --------------------------------------------------------
      // BOTÃO DE CONCLUIR
      // --------------------------------------------------------

      const check =
        document.createElement(
          "button"
        );


      check.className =
        "check";


      check.textContent =
        tarefa.concluida
          ? "✓"
          : "";


      check.setAttribute(
        "aria-label",
        tarefa.concluida
          ? "Marcar como pendente"
          : "Marcar como concluída"
      );


      check.addEventListener(
        "click",
        () =>
          alternarConcluida(
            tarefa
          )
      );


      li.appendChild(
        check
      );


      // --------------------------------------------------------
      // MODO EDIÇÃO
      // --------------------------------------------------------

      if (
        editandoId ===
        tarefa.id
      ) {

        const input =
          document.createElement(
            "input"
          );


        input.type =
          "text";


        input.className =
          "editar-input";


        input.value =
          tarefa.titulo;


        input.maxLength =
          200;


        input.addEventListener(
          "keydown",
          (e) => {

            if (
              e.key ===
              "Enter"
            ) {

              salvarTitulo(
                tarefa.id,
                input.value
              );

            }


            if (
              e.key ===
              "Escape"
            ) {

              editandoId =
                null;

              renderizar();

            }

          }
        );


        input.addEventListener(
          "blur",
          () => {

            salvarTitulo(
              tarefa.id,
              input.value
            );

          }
        );


        li.appendChild(
          input
        );


        lista.appendChild(
          li
        );


        input.focus();

        input.select();


        return;

      }


      // --------------------------------------------------------
      // TÍTULO
      // --------------------------------------------------------

      const titulo =
        document.createElement(
          "span"
        );


      titulo.className =
        "titulo";


      titulo.textContent =
        tarefa.titulo;


      titulo.addEventListener(
        "dblclick",
        () => {

          editandoId =
            tarefa.id;

          renderizar();

        }
      );


      li.appendChild(
        titulo
      );


      // --------------------------------------------------------
      // AÇÕES
      // --------------------------------------------------------

      const acoes =
        document.createElement(
          "div"
        );


      acoes.className =
        "acoes";


      // Botão editar
      const btnEditar =
        document.createElement(
          "button"
        );


      btnEditar.className =
        "acao";


      btnEditar.textContent =
        "Editar";


      btnEditar.addEventListener(
        "click",
        () => {

          editandoId =
            tarefa.id;

          renderizar();

        }
      );


      // Botão excluir
      const btnExcluir =
        document.createElement(
          "button"
        );


      btnExcluir.className =
        "acao excluir";


      btnExcluir.textContent =
        "Excluir";


      btnExcluir.addEventListener(
        "click",
        () => {

          excluirTarefa(
            tarefa
          );

        }
      );


      acoes.append(
        btnEditar,
        btnExcluir
      );


      li.appendChild(
        acoes
      );


      lista.appendChild(
        li
      );

    }
  );

}


// ============================================================
// ESTADO INICIAL
// ============================================================

trocarModo(false);

renderizar();