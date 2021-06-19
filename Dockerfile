FROM node:lts-alpine As deploy
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /home/node/app
COPY package*.json ./
RUN npm set progress=false
RUN npm install --only=production
RUN touch .env
COPY . .
EXPOSE 8000
CMD ["node", "server"]
