// ============================================================
// Minhas Tarefas — HTML, CSS, JavaScript puro + Firebase (SDK modular via CDN)
// Serviços: Authentication (e-mail/senha) + Cloud Firestore (tempo real)
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

// ---------- Inicialização ----------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- Elementos da página ----------
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

// ---------- Estado ----------
let modoCadastro = false;
let usuarioAtual = null;
let pararDeOuvir = null;   // função para cancelar o onSnapshot
let tarefas = [];          // cache local das tarefas vindas do Firestore
let filtroAtual = "todas";
let editandoId = null;

// ============================================================
// AUTENTICAÇÃO
// ============================================================
function trocarModo(cadastro) {
  modoCadastro = cadastro;
  abaLogin.classList.toggle("ativa", !cadastro);
  abaCadastro.classList.toggle("ativa", cadastro);
  abaLogin.setAttribute("aria-selected", String(!cadastro));
  abaCadastro.setAttribute("aria-selected", String(cadastro));
  btnAuth.textContent = cadastro ? "Criar conta" : "Entrar";
  inputSenha.autocomplete = cadastro ? "new-password" : "current-password";
  btnEsqueci.hidden = cadastro;
  mostrarMensagem("");
}
abaLogin.addEventListener("click", () => trocarModo(false));
abaCadastro.addEventListener("click", () => trocarModo(true));

function mostrarMensagem(texto, sucesso = false) {
  msgAuth.textContent = texto;
  msgAuth.classList.toggle("sucesso", sucesso);
}

// Traduz os códigos de erro do Firebase para mensagens claras
function traduzirErro(codigo) {
  const erros = {
    "auth/invalid-email": "E-mail inválido. Confira o formato (ex: voce@email.com).",
    "auth/missing-password": "Digite sua senha.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/email-already-in-use": "Este e-mail já tem conta. Use a aba Entrar.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "Não existe conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente de novo.",
    "auth/network-request-failed": "Sem conexão com a internet."
  };
  return erros[codigo] || "Algo deu errado (" + codigo + ").";
}

// Cadastro e login
formAuth.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = inputEmail.value.trim();
  const senha = inputSenha.value;

  btnAuth.disabled = true;
  mostrarMensagem("");
  try {
    if (modoCadastro) {
      await createUserWithEmailAndPassword(auth, email, senha);
    } else {
      await signInWithEmailAndPassword(auth, email, senha);
    }
    formAuth.reset();
    // onAuthStateChanged cuida da troca de tela
  } catch (erro) {
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnAuth.disabled = false;
  }
});

// Recuperação de senha
btnEsqueci.addEventListener("click", async () => {
  const email = inputEmail.value.trim();
  if (!email) {
    mostrarMensagem("Digite seu e-mail acima e clique em Esqueci minha senha.");
    inputEmail.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    mostrarMensagem("Enviamos um link de redefinição para " + email + ".", true);
  } catch (erro) {
    mostrarMensagem(traduzirErro(erro.code));
  }
});

// Logout
btnSair.addEventListener("click", () => signOut(auth));

// Observa o estado de login (roda ao abrir a página e a cada login/logout)
onAuthStateChanged(auth, (usuario) => {
  telaCarregando.hidden = true;
  usuarioAtual = usuario;

  if (usuario) {
    telaAuth.hidden = true;
    telaApp.hidden = false;
    usuarioEmail.textContent = usuario.email;
    ouvirTarefas(usuario.uid);
    inputNovaTarefa.focus();
  } else {
    if (pararDeOuvir) pararDeOuvir();
    pararDeOuvir = null;
    tarefas = [];
    lista.innerHTML = "";
    telaApp.hidden = true;
    telaAuth.hidden = false;
  }
});

// ============================================================
// FIRESTORE — CRUD
// Estrutura: usuarios/{uid}/tarefas/{idTarefa}
//   { titulo: string, concluida: boolean, criadoEm: timestamp }
// ============================================================
function colecaoTarefas(uid) {
  return collection(db, "usuarios", uid, "tarefas");
}

// READ — escuta em tempo real
function ouvirTarefas(uid) {
  if (pararDeOuvir) pararDeOuvir();
  const q = query(colecaoTarefas(uid), orderBy("criadoEm", "desc"));

  pararDeOuvir = onSnapshot(
    q,
    (snapshot) => {
      tarefas = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data({ serverTimestamps: "estimate" })
      }));
      renderizar();
    },
    (erro) => {
      console.error("Erro ao ler tarefas:", erro);
      alert("Não foi possível carregar as tarefas. Verifique as regras do Firestore.");
    }
  );
}

// CREATE
formTarefa.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = inputNovaTarefa.value.trim();
  if (!titulo || !usuarioAtual) return;

  inputNovaTarefa.value = "";
  try {
    await addDoc(colecaoTarefas(usuarioAtual.uid), {
      titulo,
      concluida: false,
      criadoEm: serverTimestamp()
    });
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível salvar a tarefa.");
    inputNovaTarefa.value = titulo;
  }
});

// UPDATE — marcar/desmarcar como concluída
async function alternarConcluida(tarefa) {
  await updateDoc(doc(db, "usuarios", usuarioAtual.uid, "tarefas", tarefa.id), {
    concluida: !tarefa.concluida
  });
}

// UPDATE — editar o título
async function salvarTitulo(id, novoTitulo) {
  const titulo = novoTitulo.trim();
  editandoId = null;
  if (!titulo) { renderizar(); return; }
  await updateDoc(doc(db, "usuarios", usuarioAtual.uid, "tarefas", id), { titulo });
}

// DELETE
async function excluirTarefa(tarefa) {
  if (!confirm('Excluir a tarefa "' + tarefa.titulo + '"?')) return;
  await deleteDoc(doc(db, "usuarios", usuarioAtual.uid, "tarefas", tarefa.id));
}

// ============================================================
// RENDERIZAÇÃO
// ============================================================
botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    botoesFiltro.forEach((b) => b.classList.toggle("ativo", b === botao));
    renderizar();
  });
});

function renderizar() {
  // Progresso
  const total = tarefas.length;
  const feitas = tarefas.filter((t) => t.concluida).length;
  progressoTexto.textContent = feitas + " de " + total + (total === 1 ? " concluída" : " concluídas");
  barraPreenchida.style.width = total ? (feitas / total) * 100 + "%" : "0";

  // Filtro
  const visiveis = tarefas.filter((t) =>
    filtroAtual === "pendentes" ? !t.concluida :
    filtroAtual === "concluidas" ? t.concluida : true
  );

  lista.innerHTML = "";
  listaVazia.hidden = visiveis.length > 0;

  visiveis.forEach((tarefa) => {
    const li = document.createElement("li");
    li.className = "tarefa" + (tarefa.concluida ? " feita" : "");

    // Botão de concluir
    const check = document.createElement("button");
    check.className = "check";
    check.textContent = tarefa.concluida ? "✓" : "";
    check.setAttribute("aria-label", tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída");
    check.addEventListener("click", () => alternarConcluida(tarefa));
    li.appendChild(check);

    if (editandoId === tarefa.id) {
      // Modo edição
      const input = document.createElement("input");
      input.type = "text";
      input.className = "editar-input";
      input.value = tarefa.titulo;
      input.maxLength = 200;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") salvarTitulo(tarefa.id, input.value);
        if (e.key === "Escape") { editandoId = null; renderizar(); }
      });
      input.addEventListener("blur", () => salvarTitulo(tarefa.id, input.value));
      li.appendChild(input);
      lista.appendChild(li);
      input.focus();
      input.select();
      return;
    }

    // Título (textContent evita injeção de HTML)
    const titulo = document.createElement("span");
    titulo.className = "titulo";
    titulo.textContent = tarefa.titulo;
    titulo.addEventListener("dblclick", () => { editandoId = tarefa.id; renderizar(); });
    li.appendChild(titulo);

    // Ações
    const acoes = document.createElement("div");
    acoes.className = "acoes";

    const btnEditar = document.createElement("button");
    btnEditar.className = "acao";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => { editandoId = tarefa.id; renderizar(); });

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "acao excluir";
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", () => excluirTarefa(tarefa));

    acoes.append(btnEditar, btnExcluir);
    li.appendChild(acoes);
    lista.appendChild(li);
  });
}
