import express, { Request, Response } from "express"
import { requireAuth, NotFoundError, NotAuthorizedError } from "@abhitickets/common"
import {Order} from "../models/order";

const router = express.Router();


router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response)=>{

    const order = await Order.findById(req.params.orderId)

    if(!order){
        throw new NotFoundError();
    }

    if(order.userId != req.currentUser!.id){
        throw new NotAuthorizedError();
    }

    res.status(200).send(order);
})

export { router as showOrdersRouter }