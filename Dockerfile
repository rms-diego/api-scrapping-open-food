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

# Porta que rodará o projeto dentro do container
EXPOSE 3000

# Comando para iniciar a aplicação quando o container for iniciado
ENTRYPOINT [ "npm", "start" ] 
