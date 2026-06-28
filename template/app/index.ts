import type { ServerReq, ServerRes } from "tinny-backend";
import CreateServer from "../lib/CreateSrv.js";

const srv = CreateServer(true, 3000);

srv.add({
    path: "/",
    method: "GET",
    handler: async (req: ServerReq, res: ServerRes)=>{
        return await srv.SendFile(res, "./public/example/default.html", 200)
    }
})

srv.listen()