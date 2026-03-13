import { httpRouter } from "convex/server";
import { incomingCall } from "./twilio";

const http = httpRouter();

http.route({
    path: "/twilio/incoming-call",
    method: "POST",
    handler: incomingCall,
});

// We can add other routes here

export default http;
