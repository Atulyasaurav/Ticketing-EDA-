import express from "express";
import { body } from "express-validator";
import {Request, Response} from "express";

import { validateRequest, BadRequestError } from "@abhitickets/common";
import { User} from "../models/user";
import { Password} from "../services/password";
import jwt from "jsonwebtoken";


const router =express.Router();


router.post("/api/users/signin",
    [
        body("email").isEmail().withMessage("Email is required"),
        body('password').trim().notEmpty().withMessage("Password is required")

    ],
    validateRequest,
    async (req: Request,res: Response)=>{

    const {email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new BadRequestError("Invalid Credentials!");
    }

    const passwordsMatch = await Password.compare(existingUser.password,password);

    if(!passwordsMatch){
        throw new BadRequestError("Invalid Credentials!!");
    }


// Generate JWT
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email,
    },process.env.JWT_KEY!);  // this ! says to ty-s hey we have already check and make sure that the JWT_KEY is not undefind ( we check at the start of the app)

// @ts-ignore;
    req.session.jwt = userJwt

    res.status(200).send(existingUser)
});


export default router;