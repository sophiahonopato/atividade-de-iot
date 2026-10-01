# Mural de Recados — HTML, CSS, JavaScript e Firebase Realtime Database

Mural de recados colaborativo em tempo real, desenvolvido como projeto prático do curso **"HTML, CSS, JavaScript e Firebase: Seja um FullStack developer"** (Cursa).

O front-end é feito com **HTML, CSS e JavaScript puros** (sem frameworks), integrado ao **Firebase** pelo SDK modular carregado via CDN.

🔗 **Aplicação publicada:** https://SEU-PROJETO.web.app

---

## Funcionalidades

**Autenticação (Firebase Authentication — e-mail/senha)**
- Cadastro com nome, e-mail e senha (o nome é salvo no perfil do usuário)
- Login e logout
- Recuperação de senha por e-mail
- Sessão mantida ao recarregar a página

**Banco de dados em tempo real (Realtime Database) — CRUD completo**
- **Criar:** publicar recado de até 280 caracteres
- **Ler:** mural atualizado instantaneamente com `onValue` (recados de outros usuários aparecem sem recarregar)
- **Atualizar:** editar o próprio recado e curtir/descurtir recados
- **Deletar:** excluir o próprio recado

**Recursos exclusivos do Realtime Database**
- **Presença online:** contador de pessoas conectadas agora, usando `.info/connected` e `onDisconnect()`
- **Indicador de conexão:** ponto verde/vermelho mostra se o app está conectado ao servidor

**Segurança**
- Só usuários logados leem o mural
- Cada usuário só edita e exclui os próprios recados
- Cada usuário só pode registrar a própria curtida
- Validação de tamanho e tipo dos campos nas regras do banco

**Hospedagem:** publicada no Firebase Hosting.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 |
| Estilo | CSS3 (variáveis, grid, media queries, animações) |
| Lógica | JavaScript ES6+ (módulos, async/await) |
| Autenticação | Firebase Authentication |
| Banco de dados | Firebase Realtime Database |
| Hospedagem | Firebase Hosting |

---

## Estrutura do projeto

```
mural-firebase/
├── public/
│   ├── index.html           # Telas de login/cadastro e do mural
│   ├── style.css            # Estilos (bilhetes coloridos)
│   ├── app.js               # Autenticação, CRUD e presença online
│   └── firebase-config.js   # Credenciais do projeto Firebase
├── database.rules.json      # Regras de segurança do Realtime Database
├── firebase.json            # Configuração do Hosting e do banco
├── .firebaserc              # ID do projeto Firebase
└── README.md
```

### Modelo de dados (JSON do Realtime Database)

```json
{
  "recados": {
    "-NxAbc123": {
      "texto": "Bom dia, turma!",
      "autorUid": "uid-do-autor",
      "autorNome": "Miguel",
      "criadoEm": 1759276800000,
      "editadoEm": 1759277000000,
      "curtidas": { "uid-de-quem-curtiu": true }
    }
  },
  "presenca": {
    "uid-do-usuario": { "nome": "Miguel", "desde": 1759276800000 }
  }
}
```

---

## Como executar localmente

### 1. Criar o projeto no Firebase
1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**.
2. Em **Authentication > Método de login**, ative **E-mail/senha**.
3. Em **Realtime Database**, clique em **Criar banco de dados**, escolha a localização e inicie no **modo bloqueado**.
4. Em **Configurações do projeto (⚙️) > Seus apps**, clique no ícone **</>** para registrar um app da Web e copie o objeto `firebaseConfig`.

### 2. Configurar o código
1. Cole as credenciais em `public/firebase-config.js`.
2. **Confira o campo `databaseURL`**: ele precisa ser igual à URL mostrada no topo da aba Realtime Database. Sem ele o banco não conecta.
3. Troque `SEU-PROJETO` pelo ID do seu projeto em `.firebaserc`.
4. No console, em **Realtime Database > Regras**, cole o conteúdo de `database.rules.json` e clique em **Publicar** (ou use `firebase deploy --only database`).

### 3. Rodar
Por usar módulos JavaScript (`type="module"`), o projeto **precisa de um servidor local** (abrir o `index.html` com duplo clique não funciona).

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

Opção C: no VS Code, extensão **Live Server** > botão direito em `public/index.html` > **Open with Live Server**.

**Dica para testar o tempo real:** abra o app em uma janela normal e outra anônima, entre com duas contas diferentes e publique recados. Eles aparecem nas duas telas na hora, e o contador de online mostra 2 pessoas.

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

| # | Evidência | Arquivo |
|---|---|---|
| 1 | Tela de cadastro | `evidencias/01-cadastro.png` |
| 2 | Usuários criados no Firebase Authentication | `evidencias/02-auth-console.png` |
| 3 | Mural após login | `evidencias/03-login.png` |
| 4 | Recado publicado (Create) | `evidencias/04-criar.png` |
| 5 | Árvore de dados no console do Realtime Database (Read) | `evidencias/05-database-console.png` |
| 6 | Duas janelas sincronizadas em tempo real | `evidencias/06-tempo-real.png` |
| 7 | Recado editado e curtido (Update) | `evidencias/07-atualizar.png` |
| 8 | Recado excluído (Delete) | `evidencias/08-excluir.png` |
| 9 | Aplicação publicada no Hosting | `evidencias/09-hosting.png` |

---

## Autor

**Miguel** — projeto prático do curso de HTML, CSS, JavaScript e Firebase (Cursa).
