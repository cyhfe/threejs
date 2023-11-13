FROM node:20.3.0-alpine

WORKDIR /app

RUN npm install pm2 -g

COPY package.json package*.json ./
RUN npm install

COPY . .
RUN npm run build
CMD ["pm2-runtime", "npm", "--", "start"]
EXPOSE 3000