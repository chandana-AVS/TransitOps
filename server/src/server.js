const http = require("http");
const app = require("./app");
const env = require("./config/env");
const setupSocket = require("./socket");

const server = http.createServer(app);
setupSocket(server);

server.listen(env.PORT, () => {
  console.log(`TransitOps API running on port ${env.PORT}`);
});
