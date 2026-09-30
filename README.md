# Minhas Tarefas — HTML, CSS, JavaScript e Firebase

Aplicação web de gerenciamento de tarefas desenvolvida como projeto prático do curso **"HTML, CSS, JavaScript e Firebase: Seja um FullStack developer"** (Cursa).

O front-end é feito com **HTML, CSS e JavaScript puros** (sem frameworks), integrado ao **Firebase** pelo SDK modular carregado via CDN.


---

## Funcionalidades

**Autenticação (Firebase Authentication — e-mail/senha)**
- Cadastro de novos usuários
- Login e logout
- Recuperação de senha por e-mail
- Sessão mantida ao recarregar a página
- Mensagens de erro traduzidas para o português

**Banco de dados em tempo real (Cloud Firestore) — CRUD completo**
- **Criar:** adicionar nova tarefa
- **Ler:** lista atualizada em tempo real com `onSnapshot` (abra em duas abas para ver a sincronização)
- **Atualizar:** marcar como concluída/pendente e editar o título (botão Editar ou duplo clique)
- **Deletar:** excluir tarefa com confirmação

**Extras**
- Filtros: todas, pendentes e concluídas
- Barra de progresso das tarefas concluídas
- Layout responsivo (funciona no celular)
- Regras de segurança: cada usuário acessa somente as próprias tarefas

**Hospedagem:** publicada no Firebase Hosting.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 |
| Estilo | CSS3 (variáveis, flexbox, media queries) |
| Lógica | JavaScript ES6+ (módulos, async/await) |
| Autenticação | Firebase Authentication |
| Banco de dados | Cloud Firestore |
| Hospedagem | Firebase Hosting |

---

## Estrutura do projeto

```
tarefas-firebase/
├── public/
│   ├── index.html           # Telas de login/cadastro e de tarefas
│   ├── style.css            # Estilos
│   ├── app.js               # Lógica: autenticação + CRUD no Firestore
│   └── firebase-config.js   # Credenciais do projeto Firebase
├── firestore.rules          # Regras de segurança do banco
├── firebase.json            # Configuração do Hosting e do Firestore
├── .firebaserc              # ID do projeto Firebase
└── README.md
```

### Modelo de dados (Firestore)

```
usuarios/{uid}/tarefas/{idTarefa}
  ├── titulo: string
  ├── concluida: boolean
  └── criadoEm: timestamp
```

Cada usuário tem sua própria subcoleção de tarefas, identificada pelo `uid` gerado no login.

---

## Como executar localmente

### 1. Criar o projeto no Firebase
1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**.
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Firestore Database**, clique em **Criar banco de dados** (pode iniciar em modo de produção).
4. Em **Configurações do projeto (⚙️) > Seus apps**, clique no ícone **</>** para registrar um app da Web e copie o objeto `firebaseConfig`.

### 2. Configurar o código
1. Cole as credenciais em `public/firebase-config.js`.
2. Troque `SEU-PROJETO` pelo ID do seu projeto em `.firebaserc`.
3. No console, em **Firestore > Regras**, cole o conteúdo de `firestore.rules` e clique em **Publicar** (ou use `firebase deploy --only firestore:rules`).

### 3. Rodar
Por usar módulos JavaScript (`type="module"`), o projeto **precisa de um servidor local** (abrir o `index.html` direto com duplo clique não funciona). Escolha uma opção:

```bash
# Opção A — com Node.js instalado
npx serve public
# acesse http://localhost:3000
```

```bash
# Opção B — com Firebase CLI
firebase serve
# acesse http://localhost:5000
```

Opção C: no VS Code, instale a extensão **Live Server**, clique com o botão direito em `public/index.html` > **Open with Live Server**.

---

## Como publicar (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Ao final, o terminal mostra a URL pública (`https://SEU-PROJETO.web.app`).

---

## Evidências

Os prints abaixo demonstram a aplicação em funcionamento:

| # | Evidência | Arquivo |
|---|---|---|
| 1 | Tela de cadastro | `evidencias/01-cadastro.png` |
| 2 | Usuário criado no Firebase Authentication | `evidencias/02-auth-console.png` |
| 3 | Login realizado | `evidencias/03-login.png` |
| 4 | Criar tarefa (Create) | `evidencias/04-criar.png` |
| 5 | Tarefas no console do Firestore (Read) | `evidencias/05-firestore-console.png` |
| 6 | Tarefa editada/concluída (Update) | `evidencias/06-atualizar.png` |
| 7 | Tarefa excluída (Delete) | `evidencias/07-excluir.png` |
| 8 | Aplicação publicada no Hosting | `evidencias/08-hosting.png` |

---

## Autor

**Miguel** — projeto prático do curso de HTML, CSS, JavaScript e Firebase (Cursa).
# atividade-de-iot
