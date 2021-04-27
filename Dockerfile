FROM docker.io/node:latest
RUN mkdir echo-machine
WORKDIR echo-machine
COPY package.json package.json 
RUN /usr/local/bin/npm update
RUN /usr/local/bin/npm i
COPY tsconfig.json tsconfig.json
COPY src src
RUN /usr/local/bin/npm run compile
CMD ["/usr/local/bin/node", "lib/machine.js"]
