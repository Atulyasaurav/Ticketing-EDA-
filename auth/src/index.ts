import mongoose from "mongoose";

import app from "./app"

const start = async () => {




    if(!process.env.JWT_KEY){
        console.log(process.env.JWT_KEY);
        throw new Error("JWT_KEY is required");
    }

    if(!process.env.MONGO_URI){
        throw new Error("MongoDB URI is required");
    }

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected!");
    }
    catch(err){
        console.log("Database Connection Error: ",err);
    }

    // After Successfully connecting to database we are make our server running!
    app.listen(4000,()=>{
        console.log("Auth service is running on port 4000 !!");

    })
}

start();
