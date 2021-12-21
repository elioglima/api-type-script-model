FROM node:14.17.2-alpine AS BUILD
WORKDIR /api
COPY . .
RUN npm install
RUN npm run build


FROM node:14.17.2-slim
ENV NODE_ENV=development
WORKDIR /app
COPY --from=BUILD /api/dist ./dist
COPY --from=BUILD /api/package.json ./package.json
RUN npm install --only=prod
EXPOSE 3000
CMD ["npm", "start"]
