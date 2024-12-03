import { Server } from "http";
import app from "./app";
import configs from "./configs";

async function main() {
  const server: Server = app.listen(configs.port, () => {
    console.log("Server is running on port:", configs.port);
  });
}

main();
