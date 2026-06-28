import monitor from "../admin/monitor.js"
import Server from "tinny-backend"

export default function CreateServer(monitoring: boolean, PORT: number){
    const server = new Server({port: PORT});
    if (monitoring)
        monitor(new Server({port: (PORT + 1)}))
    return server;
}