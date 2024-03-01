# Desafio técnico IN8 📚

<h1>
  Tecnologias 👨‍💻
  </br>
  </br>
  <div align="center">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
    <img src="https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white" />
  </div>
</h1>

## 🖖🏼 Objetivo

Criar uma API onde seja possível fazer a busca de alimentos através da plataforma open food

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

**- Ter criado o arquivo '.env' conforme descrito no arquivo '.env.example'. (Caso não tenha sido criado o projeto não funcionará)**

**- Ter instalado o Docker instalado (caso queira rodar pelo mesmo).**

**- Ter o node.js instalado na versão LTS atual 20.11 ou superior.**

## 🚀 Rodando o projeto (Certifique-se do terminal estar na raiz do projeto e ter cumprido os pré-requisitos)

### Rodando usando o docker a partir do Dockerfile

</hr>
</br>

**Passo 1: Fazer o build da imagem**

```shell
  docker build -t in8-challenger . # exemplo de build
```

**Passo 2: Criar um container a partir da imagem criada**

```shell
  docker run -p 3000:3000 --name in8-challenger-api -d in8-challenger # exemplo de criação de container
```

**Passo 3: Verificar se a API está no ar**

```shell
  curl http://localhost:3000 # exemplo de requisição http
```

</br>

### Rodando localmente

</hr>
</br>

**Passo 1: instale as dependências do projeto**

```shell
  npm install
```

**Passo 2: Faça o build do projeto**

```shell
  npm run build
```

**Passo 3: Rodar o projeto com script de start**

```shell
  npm start
```

## 📂 Arquitetura - Controller -> Services

```
├── modules/
│ ├── openFoodScrapping/
│ │ ├── controller/
│ │ │ ├── index.ts
│ │ │
│ │ ├── service/
│ │ │ ├── index.ts

```

## ✔️ Requisitos Funcionais

- [x] Criar um endpoint para fazer a busca de um alimento pelo seu código barra

- [x] Criar um endpoint para fazer a busca de um alimento através de termos

## Regras de Negocio

- [x] Todas as buscas devem ser feitas através de scrapping

- [x] Nenhum dado deve ser persistindo em um banco de dados

- Regra de negócios busca por código de barra

  - [x] Deve ser retornado um erro caso seja feita uma busca por um código de barra que não existe com o status de 404
  - [x] O retorno deve ser estritamente igual ao descrito no notion do desafio https://hiroyamaguch.notion.site/Vaga-para-Desenvolvedor-J-nior-5aca5eae148247848e91589e61f029e1?pvs=4

- Regra de negócios busca por termo

  - [x] O retorno deve ser estritamente igual ao descrito no notion do desafio https://hiroyamaguch.notion.site/Vaga-para-Desenvolvedor-J-nior-5aca5eae148247848e91589e61f029e1?pvs=4
  - [x] Deve ser capaz de enviar 3 parâmetros via query params (nova, nutrition, page)
  - [x] Definir um valor padrão caso algum desses parâmetros não seja passados
  - [x] Caso o Parâmetro "nova" não seja passado o valor padrão deve ser: 1
  - [x] Caso o Parâmetro "nutrition" não seja passado valor padrão deve ser: A
  - [x] Caso o Parâmetro "page" não seja passado o valor padrão deve ser: 1

  - [x] validar se o parâmetro "nutrition" é: "A", "B", "C", "D", "E"

    - [x] fazer o tratamento caso não seja um valor valido
    - [x] deve ser possível enviar em maiúsculo e minusculo

  - [x] validar se o parâmetro "nova" é: "1", "2", "3", "4"
    - [x] fazer o tratamento caso não seja um valor valido

<strong>OBS: o parâmetro page é referente a pagina do open food que você deseja fazer a busca</strong>

## Documentação

A API expõe 3 endpoints você pode consultar no endpoint abaixo:

- `GET /docs` – para acessar a documentação da API.


## Testes

Para rodar os testes execute o comando abaixo

```shell
  npm run test
```
