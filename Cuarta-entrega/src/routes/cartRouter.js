import { Router} from "express";
import { CartManager } from "../config/CartManager.js";

const cartManager = new CartManager('./Cuarta-entrega/src/data/cart.json')

const cartRouter = Router()

cartRouter.get('/', async(req,res)=>{
    try{
        const cart = await cartManager.getCart()
        res.status(200).send(cart)
        }catch(error){
            res.status(500).send({message: error.message})
        }
})

cartRouter.post( '/:pid',async (req,res)=> { 
   
    try{
        let pid= req.params.pid; 
        let quantity = req.body.quantity || 1 ;
        const data = await cartManager.addProductByCart(pid,quantity);
        res.status(200).send(data)
       } catch(e){
           console.log(e)
           res.status(500).send({message: e.message});
       }
   }
)

export default cartRouter