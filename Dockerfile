FROM node:20-alpine

WORKDIR /app 

COPY ./Faculty-Rating-System-Api-/package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
