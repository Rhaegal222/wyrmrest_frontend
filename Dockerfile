FROM node:22-alpine

LABEL maintainer="francescovecchio01@gmail.com"

ARG UID=1000
ARG GID=1000

RUN npm install -g @angular/cli@21

RUN if [ $(getent passwd node) ]; then deluser node; fi && \
    addgroup -g ${GID} appgroup && \
    adduser -u ${UID} -G appgroup -D appuser

RUN mkdir -p /app/node_modules \
    && chown -R appuser:appgroup /home/appuser /app
USER appuser

WORKDIR /app

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
