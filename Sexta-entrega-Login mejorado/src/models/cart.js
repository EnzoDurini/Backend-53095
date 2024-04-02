import { Schema, model } from 'mongoose'


const  cartSchema = new Schema({
    products: { 
        type: [{
            product: {type : Schema.Types.ObjectId , ref : "Product" },
            quantity: {type: Number, required:true}  
    }],
        default: []   
    }})

cartSchema.pre('findOne', function(){
    this.populate ('products.id_prod')    
})

const cartModel = model ('carts', cartSchema);

export default cartModel