FROM ubuntu:latest

RUN apt-get update && apt-get install -y docker.io nodejs npm
COPY . /app
WORKDIR /app
RUN npm install dockerode express cors
CMD ["node", "docker.js"]
EXPOSE 3000
