import nats from "node-nats-streaming";

import {randomBytes} from "node:crypto";

import TicketCreatedListener from "./events/ticket-created-listener";
console.clear()

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222"
})

stan.on("connect", ()=>{
    console.log("Listerner is connected to NATS Server! ");

    stan.on("close", ()=>{
        console.log("NATS connection close...");
        process.exit();
    })


    new TicketCreatedListener(stan).listen()


});

process.on("SIGINT", ()=> {
    stan.close()
})

process.on("SIGTERM", ()=> {
    stan.close()

})




