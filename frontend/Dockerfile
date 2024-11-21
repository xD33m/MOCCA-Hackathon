# Stage 1 - build the Angular application
FROM node:20-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files and install dependencies
COPY ./package*.json /app/
RUN npm install --no-audit

# Copy the rest of the application code
COPY . /app

# Build the application with dynamic base href
RUN npm run build
RUN rm -rf node_modules

# Stage 2 - build the final image and copy the Angular build files
FROM arm64v8/node:20-alpine
LABEL name="hackathon"
WORKDIR /app
ENV NODE_ENV production

# Copy built files from the build stage
COPY --from=build /app/dist/da-vinci-dialogue/browser /app/build

# Install serve to serve the application
RUN npm install -g serve
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "build"]
