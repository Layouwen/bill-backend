FROM node:15-alpine
RUN npm install -g nrm && \
    nrm use taobao && \
    npm install -g pnpm pm2
ADD ./bill-backend /app/backend
ADD ./bill-frontend /app/frontend
WORKDIR /app/frontend
RUN pnpm i
RUN npm run build:docker
WORKDIR /app/backend
RUN npm i
RUN npm run build
EXPOSE 3001
CMD ["pm2-runtime", "start", "dist/main.js", "--name", "bill-h5"]
