FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./

# Copy the prisma directory so the client can be generated
COPY prisma ./prisma/

# Install dependencies using npm (flat node_modules fixes Prisma module resolution)
RUN npm install

# Generate the Prisma client for the Linux container
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "src/main.js"]
