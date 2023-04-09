<img src="https://mestresdaweb.com.br/wp-content/uploads/2020/05/logo-negativo.png" />

# Boilerplate Backend

> Feito para você ganhar tempo iniciando um novo projeto.

<br/><br/>

<blockquote align="center">
  Contribua você também :D
</blockquote>

<hr/>

## 💡 Sobre o boilerplate

Ao invés de toda vez que você for iniciar um novo projeto backend, ter que configurar manualmente o ambiente node, express, typescript e várias outras bibliotecas que usamos durante o desenvolvimento, você pode simplesmente clonar esse repositório e correr pro abraço.

## 🔥 O que ele já possui configurado?

- ✅ Express<br/>
- ✅ Typescript<br/>
- ✅ Typeorm<br/>
- ✅ Redis<br/>
- ✅ Migrations<br/>
- ✅ Seeds<br/>
- ✅ Tratamento de erros<br/>
- ✅ Middlewares<br/>
- ✅ Providers<br/>
  - ✅ Upload: Multer E S3<br/>
  - ✅ Envio de email: Nodemailer, SES  e SendBlue<br/>
  - ✅ Template para e-mail: Handlebars<br/>
  - ✅ Push Notification: OneSignal<br/>
- ✅ Módulo de usuário: CRUD<br/>
- ✅ Autenticação: JWT e Refresh Token<br/>
- ✅ Eslint<br/>
- ✅ Prettier na régua (caso não funcione, verifique se a sua IDE está apontando corretamente para o arquivo do Prettier)<br/>
- ✅ Editorconfig<br/>
- ✅ Jest<br/>
- ✅ Tradução para validação de entrada de dados<br/>

## ⚙️ Techs

- Node
- Express
- Typeorm
- Redis

## 🏁 Como eu uso?

Para clonar esse projeto em sua máquina,
Execute o seguinte comando:

```bash
git clone https://github.com/Mestres-da-Web/boilerplate-backend-v2.git
```

Logo depois, execute o seguinte comando para retirar a origin dele que está vinculado com o repositório do boilerplate

```bash
git remote rm origin
```

Adicione o remote do seu repositório no git, mude o nome do projeto dentro do arquivo "package.json" e o nome da pasta geral do projeto.

## ✨ Instalando dependências

```
yarn
```

_ou_

```
npm install
```

#### 🏃‍♀️ Executando o projeto na máquina

Com todas as dependências instaladas, o banco de dados em execução e o ambiente configurado corretamente, agora você pode executar o back-end:

```
yarn dev:server
```

_ou_

```
npm run dev:server
```

E corra pro abraço 🚀!!!
