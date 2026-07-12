FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server/ .

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && node src/server.js"]
