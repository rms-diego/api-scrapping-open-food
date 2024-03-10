# Imagem do node na versão 20
FROM node:20-alpine

# Instalando dependências necessárias para o Puppeteer e Chrome
RUN apk update && \
  apk add --no-cache \
  udev \
  ttf-freefont \
  chromium

# Configurando variáveis de ambiente para o Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  CHROME_BIN=/usr/bin/chromium-browser \
  CHROMIUM_PATH=/usr/bin/chromium-browser

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
