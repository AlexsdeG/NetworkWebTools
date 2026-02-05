FROM node:18-alpine

# Install build tools and pnpm
RUN apk add --no-cache python3 make g++ bash
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy project files. When building from the repository root, the root lockfile
# will be available to the build context which ensures reproducible installs.
COPY . .

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Expose internal app port
EXPOSE 3010

# Start the compiled Nest/Express app
CMD ["node", "dist/main.js"]
