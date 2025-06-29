import express,{Request,Response} from "express";
import { body} from "express-validator";
import jwt from "jsonwebtoken";

import {BadRequestError} from "@abhitickets/common";
import {User} from "../models/user";
import {validateRequest} from "@abhitickets/common";

const router =express.Router();


router.post("/api/users/signup",
    [
        body("email").isEmail().withMessage("Invalid Email!"),
        body("password").trim().isLength({min: 4, max: 18}).withMessage("Password must be at least 4 characters"),
    ],
    validateRequest,

    async (req: Request, res: Response)=>{

        const {email,password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            throw new BadRequestError("User already exists with this email address");
        }

        const user = User.build({email,password})
        await user.save();

        // Generate JWT

        const userJwt = jwt.sign({
            id: user.id,
            email: user.email,
        },process.env.JWT_KEY!);  // this ! says to ty-s hey we have already check and make sure that the JWT_KEY is not undefind ( we check at the start of the app)

        // @ts-ignore;
        req.session.jwt = userJwt;

        res.status(201).send(user)


    });


export default router;