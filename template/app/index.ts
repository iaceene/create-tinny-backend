import Server from "tinny-backend";
import CreateServer from "../lib/CreateSrv.js";

const srv = CreateServer(true, 3000);

srv.listen()