# Use an official Node.js runtime as a parent image
FROM node:16

# Set environment variable for Yarn installation
ENV PATH="/usr/local/share/.yarn/bin:/usr/local/share/.config/yarn/global/node_modules/.bin:$PATH"

# Install Yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

# Install TypeScript globally
RUN yarn global add typescript

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN yarn install

# Bundle app source
COPY . .

# Build TypeScript to JavaScript
RUN yarn build

# Your application listens on port 3000 by default
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "dist/index.js" ] # Adjust "dist/app.js" as necessary
