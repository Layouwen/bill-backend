FROM node:16-alpine
RUN npm config set registry https://registry.npm.taobao.org && \
    npm i -g npm && \
    npm install -g pnpm pm2 yarn
ADD ./bill-backend /app/backend
ADD ./bill-frontend /app/frontend
WORKDIR /app/frontend
RUN pnpm i && pnpm build:docker
WORKDIR /app/backend
RUN yarn && yarn build
EXPOSE 3001
CMD ["pm2-runtime", "start", "dist/main.js", "--name", "bill-h5"]
