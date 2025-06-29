import mongoose from "mongoose";

import { Password } from "../services/password";

// An interface that describe the property that are required to create a new user
interface UserAttrs{
    email: string,
    password: string,
}

// An interface that describes the properties that a user model has

interface UserModel extends mongoose.Model <UserDoc>{
    build(arrts: UserAttrs): UserDoc;
}

// Am interface that describe that the user document has

interface UserDoc extends mongoose.Document{
    email: string,
    password: string
}


// here we are defining the schema (user model)
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    // here when we transform the user object
    toJSON:{
        transform: (doc,ret)=>{

            // here we transform the object (delete the object)
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v
        }
    }
})

userSchema.pre("save", async function(done){
    if(this.isModified("password")){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})


userSchema.statics.build = (attrs: UserAttrs) =>{
    return new User(attrs);

}


// feeding the scheema to the moongoose
const User = mongoose.model<UserDoc, UserModel>("User",userSchema);

const user = User.build({
    email: "test@test.c0om",
    password: "123456"
})


export {User};