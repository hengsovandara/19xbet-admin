# FROM node:lts as dependencies
# WORKDIR /MWIN
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# FROM node:lts as builder
# WORKDIR /MWIN
# COPY . .
# COPY --from=dependencies /MWIN/node_modules ./node_modules
# RUN yarn build

# FROM node:lts as runner
# WORKDIR /MWIN
# # If you are using a custom next.config.js file, uncomment this line.
# # COPY --from=builder /MWIN/next.config.js ./
# COPY --from=builder /MWIN/public ./public
# COPY --from=builder /MWIN/.next ./.next
# COPY --from=builder /MWIN/node_modules ./node_modules
# COPY --from=builder /MWIN/package.json ./package.json

# EXPOSE 3000

FROM mhart/alpine-node
WORKDIR /app
COPY ./.next /app/.next
COPY ./public /app/public
COPY ./static /app/static
COPY ./node_modules /app/node_modules
COPY ./package.json /app/package.json
COPY ./next.config.js /app/next.config.js

CMD ["npm", "run", "prod"]