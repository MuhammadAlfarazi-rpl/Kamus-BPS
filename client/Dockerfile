FROM node:20-alpine as BUILD_IMAGE

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine as PRODUCTION_IMAGE

COPY --from=BUILD_IMAGE /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]