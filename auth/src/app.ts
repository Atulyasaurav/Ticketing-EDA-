import express from "express";
import bodyParser from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import currentUserRouter from "./routes/current-user"
import signinRouter from "./routes/signin"
import signupRouter from "./routes/signup"
import signoutRouter from "./routes/signout";


import { errorHandler, NotFoundError} from "@abhitickets/common"


const app = express();

app.set("trust proxy", true);  // to trust ingress

app.use(bodyParser.json());

app.use(cookieSession({
    secure: process.env.NODE_ENV !== "test",  // user visiting HTTPS connection
    signed: false, // disable encryption

}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter)

app.all("*",async (req,res,next) => {
    throw new NotFoundError();
})

app.use(errorHandler);


export default app;