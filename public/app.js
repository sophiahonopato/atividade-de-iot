// ============================================================
<<<<<<< HEAD
// Mural de Recados — HTML, CSS, JavaScript puro + Firebase (SDK modular via CDN)
// Serviços: Authentication (e-mail/senha) + Realtime Database
=======
// Minhas Tarefas — HTML, CSS, JavaScript puro + Firebase (SDK modular via CDN)
// Serviços: Authentication (e-mail/senha) + Cloud Firestore (tempo real)
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
<<<<<<< HEAD
  updateProfile,
=======
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
<<<<<<< HEAD
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  onDisconnect,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
=======
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
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
import { firebaseConfig } from "./firebase-config.js";

// ---------- Inicialização ----------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
<<<<<<< HEAD
const db = getDatabase(app);

// ---------- Elementos ----------
=======
const db = getFirestore(app);

// ---------- Elementos da página ----------
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
const $ = (id) => document.getElementById(id);
const telaCarregando = $("tela-carregando");
const telaAuth = $("tela-auth");
const telaApp = $("tela-app");

const abaLogin = $("aba-login");
const abaCadastro = $("aba-cadastro");
const formAuth = $("form-auth");
<<<<<<< HEAD
const campoNome = $("campo-nome");
const inputNome = $("nome");
=======
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
const inputEmail = $("email");
const inputSenha = $("senha");
const msgAuth = $("msg-auth");
const btnAuth = $("btn-auth");
const btnEsqueci = $("btn-esqueci");

<<<<<<< HEAD
const usuarioNome = $("usuario-nome");
const btnSair = $("btn-sair");
const pontoConexao = $("ponto-conexao");
const textoOnline = $("texto-online");
const formRecado = $("form-recado");
const textoRecado = $("texto-recado");
const contador = $("contador");
const mural = $("mural");
const muralVazio = $("mural-vazio");

// ---------- Estado ----------
let modoCadastro = false;
let criandoConta = false;      // evita abrir o mural antes de salvar o nome
let usuarioAtual = null;
let recados = [];
let editandoId = null;
let idsJaVistos = new Set();   // para animar só recados novos
let ouvintes = [];             // funções para cancelar os onValue
=======
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
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5

// ============================================================
// AUTENTICAÇÃO
// ============================================================
function trocarModo(cadastro) {
  modoCadastro = cadastro;
  abaLogin.classList.toggle("ativa", !cadastro);
  abaCadastro.classList.toggle("ativa", cadastro);
  abaLogin.setAttribute("aria-selected", String(!cadastro));
  abaCadastro.setAttribute("aria-selected", String(cadastro));
<<<<<<< HEAD
  campoNome.hidden = !cadastro;
=======
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
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

<<<<<<< HEAD
=======
// Traduz os códigos de erro do Firebase para mensagens claras
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
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

<<<<<<< HEAD
=======
// Cadastro e login
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
formAuth.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = inputEmail.value.trim();
  const senha = inputSenha.value;
<<<<<<< HEAD
  const nome = inputNome.value.trim();

  if (modoCadastro && !nome) {
    mostrarMensagem("Digite seu nome para aparecer nos recados.");
    inputNome.focus();
    return;
  }
=======
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5

  btnAuth.disabled = true;
  mostrarMensagem("");
  try {
    if (modoCadastro) {
<<<<<<< HEAD
      criandoConta = true;
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(cred.user, { displayName: nome }); // salva o nome no perfil
      criandoConta = false;
      abrirMural(cred.user);
=======
      await createUserWithEmailAndPassword(auth, email, senha);
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
    } else {
      await signInWithEmailAndPassword(auth, email, senha);
    }
    formAuth.reset();
<<<<<<< HEAD
  } catch (erro) {
    criandoConta = false;
=======
    // onAuthStateChanged cuida da troca de tela
  } catch (erro) {
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
    mostrarMensagem(traduzirErro(erro.code));
  } finally {
    btnAuth.disabled = false;
  }
});

<<<<<<< HEAD
=======
// Recuperação de senha
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
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

<<<<<<< HEAD
btnSair.addEventListener("click", async () => {
  // Remove a presença ANTES de sair (depois do logout as regras bloqueiam)
  if (usuarioAtual) await remove(ref(db, "presenca/" + usuarioAtual.uid)).catch(() => {});
  pararOuvintes();
  await signOut(auth);
});

onAuthStateChanged(auth, (usuario) => {
  telaCarregando.hidden = true;
  if (usuario) {
    if (!criandoConta) abrirMural(usuario);
  } else {
    fecharMural();
  }
});

function nomeDoUsuario(usuario) {
  return usuario.displayName || usuario.email.split("@")[0];
}

function abrirMural(usuario) {
  usuarioAtual = usuario;
  telaAuth.hidden = true;
  telaApp.hidden = false;
  usuarioNome.textContent = nomeDoUsuario(usuario);
  iniciarPresenca(usuario);
  ouvirRecados();
  textoRecado.focus();
}

function fecharMural() {
  pararOuvintes();
  usuarioAtual = null;
  recados = [];
  idsJaVistos = new Set();
  mural.innerHTML = "";
  telaApp.hidden = true;
  telaAuth.hidden = false;
}

function pararOuvintes() {
  ouvintes.forEach((parar) => parar());
  ouvintes = [];
}

// ============================================================
// PRESENÇA ONLINE (recurso exclusivo do Realtime Database)
// .info/connected informa se o app está conectado ao servidor.
// onDisconnect() remove o usuário da lista quando ele fecha a aba.
// ============================================================
function iniciarPresenca(usuario) {
  const minhaPresenca = ref(db, "presenca/" + usuario.uid);

  const pararConexao = onValue(ref(db, ".info/connected"), async (snap) => {
    const conectado = snap.val() === true;
    pontoConexao.classList.toggle("online", conectado);
    if (!conectado) {
      textoOnline.textContent = "Sem conexão. Tentando reconectar…";
      return;
    }
    await onDisconnect(minhaPresenca).remove();
    await set(minhaPresenca, { nome: nomeDoUsuario(usuario), desde: serverTimestamp() });
  });

  const pararLista = onValue(ref(db, "presenca"), (snap) => {
    const total = snap.size;
    textoOnline.textContent = total === 1 ? "1 pessoa online agora" : total + " pessoas online agora";
  });

  ouvintes.push(pararConexao, pararLista);
}

// ============================================================
// REALTIME DATABASE — CRUD
// Estrutura:
//   recados/{idRecado}
//     texto, autorUid, autorNome, criadoEm, editadoEm?
//     curtidas/{uid}: true
// ============================================================

// READ — escuta os últimos 100 recados em tempo real
function ouvirRecados() {
  const consulta = query(ref(db, "recados"), orderByChild("criadoEm"), limitToLast(100));
  const parar = onValue(
    consulta,
    (snapshot) => {
      const lista = [];
      snapshot.forEach((filho) => { lista.push({ id: filho.key, ...filho.val() }); });
      recados = lista.reverse(); // mais novos primeiro
      renderizar();
    },
    (erro) => {
      console.error("Erro ao ler recados:", erro);
      alert("Não foi possível carregar o mural. Verifique as regras do Realtime Database.");
    }
  );
  ouvintes.push(parar);
}

// CREATE
textoRecado.addEventListener("input", () => {
  contador.textContent = textoRecado.value.length + "/280";
});

formRecado.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = textoRecado.value.trim();
  if (!texto || !usuarioAtual) return;

  textoRecado.value = "";
  contador.textContent = "0/280";
  try {
    await push(ref(db, "recados"), {
      texto,
      autorUid: usuarioAtual.uid,
      autorNome: nomeDoUsuario(usuarioAtual),
=======
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
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
      criadoEm: serverTimestamp()
    });
  } catch (erro) {
    console.error(erro);
<<<<<<< HEAD
    alert("Não foi possível publicar o recado.");
    textoRecado.value = texto;
  }
});

// UPDATE — editar texto
async function salvarEdicao(id, novoTexto) {
  const texto = novoTexto.trim();
  editandoId = null;
  if (!texto) { renderizar(); return; }
  await update(ref(db, "recados/" + id), { texto, editadoEm: serverTimestamp() });
}

// UPDATE — curtir / descurtir
async function alternarCurtida(recado) {
  const minhaCurtida = ref(db, "recados/" + recado.id + "/curtidas/" + usuarioAtual.uid);
  const jaCurti = recado.curtidas && recado.curtidas[usuarioAtual.uid];
  if (jaCurti) await remove(minhaCurtida);
  else await set(minhaCurtida, true);
}

// DELETE
async function excluirRecado(recado) {
  if (!confirm("Excluir este recado do mural?")) return;
  await remove(ref(db, "recados/" + recado.id));
=======
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
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
}

// ============================================================
// RENDERIZAÇÃO
// ============================================================
<<<<<<< HEAD
const cores = ["--bilhete-1", "--bilhete-2", "--bilhete-3", "--bilhete-4", "--bilhete-5"];

// Gera sempre a mesma cor/inclinação para o mesmo recado
function numeroDoId(id) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return n;
}

function formatarData(ms) {
  if (typeof ms !== "number") return "agora";
  return new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
  });
}

function renderizar() {
  mural.innerHTML = "";
  muralVazio.hidden = recados.length > 0;

  recados.forEach((recado) => {
    const n = numeroDoId(recado.id);
    const meu = recado.autorUid === usuarioAtual.uid;

    const bilhete = document.createElement("article");
    bilhete.className = "bilhete";
    bilhete.style.setProperty("--cor", "var(" + cores[n % cores.length] + ")");
    bilhete.style.setProperty("--giro", ((n % 7) - 3) * 0.7 + "deg");
    if (idsJaVistos.size > 0 && !idsJaVistos.has(recado.id)) bilhete.classList.add("novo");

    // Texto ou editor
    if (editandoId === recado.id) {
      const area = document.createElement("textarea");
      area.value = recado.texto;
      area.maxLength = 280;
      area.setAttribute("aria-label", "Editar recado");
      area.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { editandoId = null; renderizar(); }
      });
      bilhete.appendChild(area);

      const acoes = document.createElement("div");
      acoes.className = "bilhete-acoes";
      acoes.append(
        criarBotao("Salvar", "acao", () => salvarEdicao(recado.id, area.value)),
        criarBotao("Cancelar", "acao", () => { editandoId = null; renderizar(); })
      );
      bilhete.appendChild(acoes);
      mural.appendChild(bilhete);
      area.focus();
      return;
    }

    const texto = document.createElement("p");
    texto.className = "bilhete-texto";
    texto.textContent = recado.texto; // textContent impede injeção de HTML
    bilhete.appendChild(texto);

    const autor = document.createElement("p");
    autor.className = "bilhete-autor";
    autor.textContent = meu ? recado.autorNome + " (você)" : recado.autorNome;
    bilhete.appendChild(autor);

    const data = document.createElement("p");
    data.className = "bilhete-data";
    data.textContent = formatarData(recado.criadoEm) + (recado.editadoEm ? " · editado" : "");
    bilhete.appendChild(data);

    // Ações
    const acoes = document.createElement("div");
    acoes.className = "bilhete-acoes";

    const curtidas = recado.curtidas ? Object.keys(recado.curtidas).length : 0;
    const curti = !!(recado.curtidas && recado.curtidas[usuarioAtual.uid]);
    const btnCurtir = criarBotao((curti ? "♥ " : "♡ ") + curtidas, "acao curtir" + (curti ? " ativo" : ""), () => alternarCurtida(recado));
    btnCurtir.setAttribute("aria-label", (curti ? "Descurtir" : "Curtir") + ", " + curtidas + " curtidas");
    acoes.appendChild(btnCurtir);

    if (meu) {
      acoes.append(
        criarBotao("Editar", "acao", () => { editandoId = recado.id; renderizar(); }),
        criarBotao("Excluir", "acao excluir", () => excluirRecado(recado))
      );
    }
    bilhete.appendChild(acoes);
    mural.appendChild(bilhete);
  });

  recados.forEach((r) => idsJaVistos.add(r.id));
  if (idsJaVistos.size === 0) idsJaVistos.add("__inicial__");
}

function criarBotao(texto, classe, aoClicar) {
  const b = document.createElement("button");
  b.className = classe;
  b.textContent = texto;
  b.addEventListener("click", aoClicar);
  return b;
=======
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
>>>>>>> cd434c01147b499fceefb0c0ab65e7f8c91f82f5
}
