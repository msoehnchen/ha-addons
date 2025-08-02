FROM node:24-alpine3.22

WORKDIR /app
# Copy package.json and package-lock.json first to leverage Docker cache
# This allows Docker to cache the npm install step, so it doesn't run every time you change your source code
COPY package*.json ./

# Install dependencies
#RUN apk add --no-cache python3 make g++
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 3443


CMD ["node", "app.js"]