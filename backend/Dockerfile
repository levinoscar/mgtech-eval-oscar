FROM node:22 AS base

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app (ts, prisma, configs)
COPY tsconfig.json ./
COPY jest.config.cjs ./
COPY prisma ./prisma
COPY public ./public
COPY src ./src

EXPOSE 3000

# Default command (overridden by docker-compose for dev)
CMD ["npm", "run", "dev"]
