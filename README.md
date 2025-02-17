# 📝 Rastreador de Problemas

Construção de um aplicativo Full Stack JavaScript para rastreamento de problemas, funcionalmente similar a este: [Issue Tracker](https://issue-tracker.freecodecamp.rocks/).

## 📌 Tecnologias Utilizadas

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**
- ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) **Express.js**
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB**
- ![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white) **Chai.js**
- ![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white) **Mocha.js**

## 🚀 Como executar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Sub-Dev/freecodecamp_issuetracker
cd freecodecamp_issuetracker
```

### 2️⃣ Instalar dependências

```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure:

```
PORT=3000
NODE_ENV=test
MONGO_URI=mongodb
```

### 4️⃣ Rodar o servidor

```bash
npm start
```

### 5️⃣ Executar testes

```bash
npm run test
```

## 🛠️ Funcionalidades Implementadas

### ✨ Endpoints da API

- **Criar uma issue:** `POST /api/issues/{project}`
- **Buscar issues de um projeto:** `GET /api/issues/{project}`
- **Buscar issues filtradas:** `GET /api/issues/{project}?open=false`
- **Atualizar uma issue:** `PUT /api/issues/{project}`
- **Excluir uma issue:** `DELETE /api/issues/{project}`

### ✅ Testes Implementados

- Criar uma issue com todos os campos
- Criar uma issue com campos obrigatórios
- Criar uma issue sem campos obrigatórios (erro esperado)
- Buscar issues de um projeto
- Buscar issues com filtros
- Atualizar uma issue
- Atualizar uma issue sem ID (erro esperado)
- Atualizar uma issue sem campos para alterar (erro esperado)
- Excluir uma issue
- Excluir uma issue sem ID (erro esperado)

## 🔗 Links Importantes

- 📂 **Código-Fonte:** [GitHub Repo](https://github.com/Sub-Dev/freecodecamp_issuetracker)

## 👥 Autor

<table>
 <tr>
 <td alinhar="centro">
 <a href="https://github.com/Sub-Dev" target="_blank">
 <img src="https://avatars.githubusercontent.com/u/68450692?v=4" alt="Anthony-Marin" height="30" width="30"/>
 </a>
 </td>
 <td>
 <strong>Anthony Marin</strong> (Sub-Dev) - <a href="https://github.com/Sub-Dev">Perfil no GitHub</a>
 </td>
 </tr>
</table>
