FROM node:22

WORKDIR  /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

ENV MODEL_URL=https://storage.googleapis.com/submissionmlgc-jandhu-bucket/submissions-model/model.json

CMD ["npm", "start"]