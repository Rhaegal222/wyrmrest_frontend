FROM node:22-alpine

LABEL maintainer="francescovecchio01@gmail.com"

RUN npm install -g @angular/cli@21

RUN chown -R node:node /home/node
USER node

WORKDIR /app

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
