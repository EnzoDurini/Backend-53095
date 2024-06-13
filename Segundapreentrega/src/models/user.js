import { Schema, model } from "mongoose";


const  userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    age:{type : Number, required: true},
    emai: { type: String , unique:true, required: true},
    rol: {type: String, default:'User'}
});

export const userModel= model( 'users',userSchema);
