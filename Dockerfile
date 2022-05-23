FROM node:14-alpine
RUN npm i -g npm@8.6.0 && \
    npm config set registry https://registry.npm.taobao.org && \
    npm i -g pnpm@6 pm2 && \
    pnpm i -g yarn
ADD ./bill-backend /app/backend
ADD ./bill-frontend /app/frontend
WORKDIR /app/frontend
RUN pnpm i && pnpm build:docker \
WORKDIR /app/backend
RUN yarn && yarn run build
EXPOSE 3001
CMD ["pm2-runtime", "start", "dist/main.js", "--name", "bill-h5"]
