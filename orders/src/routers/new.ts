import express, { Request, Response } from "express"

import {requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError} from "@abhitickets/common"
import { body } from "express-validator"
import mongoose from "mongoose";
import { Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderCreatedPublisher} from "../events/publisher/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();


router.post("/api/orders", requireAuth , [
    body("ticketId")
        .not()
        .isEmpty()
        .custom((ticketId: string)=> mongoose.Types.ObjectId.isValid(ticketId))
        .withMessage("Please provide valid ticketId")
], validateRequest ,async (req: Request, res: Response)=>{


    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if( !ticket ){
        throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()

    if( isReserved){
        throw new BadRequestError("Ticket is already been reserved!");
    }
    console.log(ticket)

    const expiration = new Date();
    expiration.setSeconds( expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS );

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    })

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket:  {
            id: ticket.id,
            price: ticket.price
        }
    })



    res.status(201).send(order);
})

export { router as newOrdersRouter }








