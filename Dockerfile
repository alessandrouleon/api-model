# Dockerfile.dev (ou Dockerfile)
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (cache eficiente)
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 4000

# Comando para desenvolvimento (com hot reload se necessário)
CMD ["npm", "run", "start:dev"]