# Usar uma imagem base com Node.js
FROM node:18-slim

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do projeto (package.json e server.js)
COPY package*.json ./
COPY server.js ./

# Instalar as dependências do projeto
RUN npm install

# Expor a porta usada pela API
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
