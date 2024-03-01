# Imagem do node na versão 14
FROM node:20-alpine

# Criando diretorio /app dentro do container
WORKDIR /app

# Copiando arquivos da raiz para o diretorio criado no container
COPY . .

# Instalando dependencias no projeto
RUN npm install

# Buildando o projeto
RUN npm run build

# Comando para iniciar a aplicação quando o container for iniciado
ENTRYPOINT [ "npm", "start" ] 
