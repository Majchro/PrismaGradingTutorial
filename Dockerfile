FROM 'node:latest'
WORKDIR /app
COPY . /app
CMD npm install && npm run dev
