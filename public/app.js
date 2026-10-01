// ============================================================
// MINHAS TAREFAS
// HTML + CSS + JavaScript + Firebase
// Authentication (e-mail/senha) + Cloud Firestore
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

import { firebaseConfig } from "./firebase-config.js";


// ============================================================
// INICIALIZAÇÃO DO FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const $ = (id) => document.getElementById(id);


// Telas
const telaCarregando = $("tela-carregando");
const telaAuth = $("tela-auth");
const telaApp = $("tela-app");


// Abas de login/cadastro
const abaLogin = $("aba-login");
const abaCadastro = $("aba-cadastro");


// Formulário de autenticação
const formAuth = $("form-auth");
const inputEmail = $("email");
const inputSenha = $("senha");
const msgAuth = $("msg-auth");
const btnAuth = $("btn-auth");
const btnEsqueci = $("btn-esqueci");


// Área do usuário
const usuarioEmail = $("usuario-email");
const btnSair = $("btn-sair");


// Tarefas
const formTarefa = $("form-tarefa");
const inputNovaTarefa = $("nova-tarefa");
const lista = $("lista-tarefas");
const listaVazia = $("lista-vazia");


// Progresso
const progressoTexto = $("progresso-texto");
const barraPreenchida = $("barra-preenchida");


// Filtros
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


// Alterna entre Login e Cadastro
function trocarModo(cadastro) {

  modoCadastro = cadastro;

  abaLogin.classList.toggle("ativa", !cadastro);

  abaCadastro.classList.toggle("ativa", cadastro);

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


// Clique na aba Login
abaLogin.addEventListener("click", () => {
  trocarModo(false);
});


// Clique na aba Cadastro
abaCadastro.addEventListener("click", () => {
  trocarModo(true);
});


// ============================================================
// MENSAGENS DE AUTENTICAÇÃO
// ============================================================

function mostrarMensagem(texto, sucesso = false) {

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
      "E-mail inválido. Confira o formato (ex: voce@email.com).",

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
      "Muitas tentativas. Aguarde alguns minutos e tente de novo.",

    "auth/network-request-failed":
      "Sem conexão com a internet.",

    "auth/api-key-not-valid":
      "A chave da API do Firebase não é válida. Confira o firebase-config.js.",

    "auth/operation-not-allowed":
      "O login por e-mail e senha não está ativado no Firebase.",

    "auth/invalid-api-key":
      "A chave da API do Firebase não é válida."

  };

  return (
    erros[codigo] ||
    "Algo deu errado (" + codigo + ")."
  );
}


// ============================================================
// LOGIN / CADASTRO
// ============================================================

formAuth.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = inputEmail.value.trim();

  const senha = inputSenha.value;


  // Verificação básica
  if (!email) {

    mostrarMensagem("Digite seu e-mail.");

    inputEmail.focus();

    return;
  }


  if (!senha) {

    mostrarMensagem("Digite sua senha.");

    inputSenha.focus();

    return;
  }


  btnAuth.disabled = true;

  mostrarMensagem("");


  try {

    // --------------------------------------------------------
    // CADASTRO
    // --------------------------------------------------------

    if (modoCadastro) {

      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

    }

    // --------------------------------------------------------
    // LOGIN
    // --------------------------------------------------------

    else {

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

    }


    // O onAuthStateChanged cuida
    // da troca de tela.

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

});


// ============================================================
// RECUPERAÇÃO DE SENHA
// ============================================================

btnEsqueci.addEventListener(
  "click",
  async () => {

    const email = inputEmail.value.trim();


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
        "Enviamos um link de redefinição para " +
        email +
        ".",
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
// OBSERVA O ESTADO DE LOGIN
// ============================================================

onAuthStateChanged(
  auth,
  (usuario) => {

    telaCarregando.hidden = true;


    // --------------------------------------------------------
    // USUÁRIO LOGADO
    // --------------------------------------------------------

    if (usuario) {

      usuarioAtual = usuario;

      telaAuth.hidden = true;

      telaApp.hidden = false;

      usuarioEmail.textContent =
        usuario.email || "";

      ouvirTarefas(usuario.uid);

      inputNovaTarefa.focus();

    }


    // --------------------------------------------------------
    // USUÁRIO DESLOGADO
    // --------------------------------------------------------

    else {

      usuarioAtual = null;


      // Para o listener do Firestore
      if (pararDeOuvir) {

        pararDeOuvir();

        pararDeOuvir = null;

      }


      tarefas = [];

      editandoId = null;

      lista.innerHTML = "";


      telaApp.hidden = true;

      telaAuth.hidden = false;

    }

  }
);


// ============================================================
// FIRESTORE
//
// Estrutura:
// usuarios
//   └── UID_DO_USUARIO
//       └── tarefas
//           └── ID_DA_TAREFA
//
// Cada tarefa:
// {
//   titulo: string,
//   concluida: boolean,
//   criadoEm: timestamp
// }
// ============================================================


// Retorna a coleção de tarefas
// do usuário atualmente logado.

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


  // Se já existe um listener,
  // encerra antes de criar outro.

  if (pararDeOuvir) {

    pararDeOuvir();

    pararDeOuvir = null;

  }


  // Consulta as tarefas ordenadas
  // da mais nova para a mais antiga.

  const q = query(
    colecaoTarefas(uid),
    orderBy(
      "criadoEm",
      "desc"
    )
  );


  // Escuta alterações em tempo real.

  pararDeOuvir = onSnapshot(

    q,

    (snapshot) => {

      tarefas = snapshot.docs.map(
        (documento) => ({

          id: documento.id,

          ...documento.data({
            serverTimestamps: "estimate"
          })

        })
      );


      renderizar();

    },


    (erro) => {

      console.error(
        "Erro ao ler tarefas:",
        erro
      );


      alert(
        "Não foi possível carregar as tarefas. " +
        "Verifique as regras do Firestore."
      );

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


    // Não permite tarefa vazia
    if (!titulo) {

      return;

    }


    // Precisa estar logado
    if (!usuarioAtual) {

      return;

    }


    // Limpa o campo imediatamente
    inputNovaTarefa.value = "";


    try {

      await addDoc(
        colecaoTarefas(
          usuarioAtual.uid
        ),
        {

          titulo: titulo,

          concluida: false,

          criadoEm: serverTimestamp()

        }
      );


    } catch (erro) {

      console.error(
        "Erro ao salvar tarefa:",
        erro
      );


      alert(
        "Não foi possível salvar a tarefa."
      );


      // Devolve o texto para o campo
      inputNovaTarefa.value = titulo;

    }

  }
);


// ============================================================
// MARCAR / DESMARCAR TAREFA
// ============================================================

async function alternarConcluida(tarefa) {

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
        concluida: !tarefa.concluida
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


  // Não salva título vazio
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
        titulo: titulo
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

    renderizar();

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


  const confirmar = confirm(
    'Excluir a tarefa "' +
    tarefa.titulo +
    '"?'
  );


  if (!confirmar) {

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
          botao.dataset.filtro;


        // Atualiza botão ativo

        botoesFiltro.forEach(
          (outroBotao) => {

            outroBotao.classList.toggle(
              "ativo",
              outroBotao === botao
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


  // ----------------------------------------------------------
  // PROGRESSO
  // ----------------------------------------------------------

  const total =
    tarefas.length;


  const feitas =
    tarefas.filter(
      (tarefa) =>
        tarefa.concluida
    ).length;


  progressoTexto.textContent =
    feitas +
    " de " +
    total +
    (
      total === 1
        ? " concluída"
        : " concluídas"
    );


  const porcentagem =
    total
      ? (feitas / total) * 100
      : 0;


  barraPreenchida.style.width =
    porcentagem + "%";


  // ----------------------------------------------------------
  // FILTRO
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // LIMPA A LISTA
  // ----------------------------------------------------------

  lista.innerHTML = "";


  listaVazia.hidden =
    visiveis.length > 0;


  // ----------------------------------------------------------
  // CRIA CADA TAREFA
  // ----------------------------------------------------------

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


      // ------------------------------------------------------
      // BOTÃO CHECK
      // ------------------------------------------------------

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


      li.appendChild(check);


      // ------------------------------------------------------
      // MODO DE EDIÇÃO
      // ------------------------------------------------------

      if (
        editandoId ===
        tarefa.id
      ) {

        const input =
          document.createElement(
            "input"
          );


        input.type = "text";

        input.className =
          "editar-input";

        input.value =
          tarefa.titulo;

        input.maxLength = 200;


        // Enter salva

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

              editandoId = null;

              renderizar();

            }

          }
        );


        // Ao perder foco,
        // salva automaticamente.

        input.addEventListener(
          "blur",
          () => {

            if (
              editandoId ===
              tarefa.id
            ) {

              salvarTitulo(
                tarefa.id,
                input.value
              );

            }

          }
        );


        li.appendChild(input);

        lista.appendChild(li);


        input.focus();

        input.select();

        return;

      }


      // ------------------------------------------------------
      // TÍTULO
      // ------------------------------------------------------

      const titulo =
        document.createElement(
          "span"
        );


      titulo.className =
        "titulo";


      // textContent evita
      // interpretação de HTML.

      titulo.textContent =
        tarefa.titulo;


      // Duplo clique edita

      titulo.addEventListener(
        "dblclick",
        () => {

          editandoId =
            tarefa.id;

          renderizar();

        }
      );


      li.appendChild(titulo);


      // ------------------------------------------------------
      // AÇÕES
      // ------------------------------------------------------

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
        () =>
          excluirTarefa(
            tarefa
          )
      );


      // Adiciona os dois botões

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
// INICIALIZAÇÃO
// ============================================================

// Começa na aba Login.

trocarModo(false);