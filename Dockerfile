FROM node:20-alpine
COPY package*.json ./

 RUN npm ci --only=production=false

 COPY . .

 RUN npm run build

 RUN npm ci --only=production

 EXPOSE 3000

 CMD [ "node", "dist/server.js" ]
