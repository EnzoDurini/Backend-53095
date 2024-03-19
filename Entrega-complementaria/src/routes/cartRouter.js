import { Router} from "express";
import cartModel from "../models/cart.js";


const cartRouter = Router()

cartRouter.post('/', async (req, res) => {
    try {
        const mensaje = await cartModel.create({ products: [] })
        res.status(201).send(mensaje)
    } catch (e) {
        res.status(500).send(`Error interno del servidor al crear carrito: ${error}`)
    }
})

cartRouter.get('/:cid', async(req,res)=>{
    try{
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId) 
        res.status(200).send(cart)
        }catch(error){
            res.status(500).send({message: error.message})
        }
})

cartRouter.post( '/:cid/:pid',async (req,res)=> { 
   
    try{
        let cartId= req.params.cid
        let productId=req.params.pid
        let {quantity} = req.body
        const cart = await cartModel.findById(cartId)
        const indice = cart.products.findIndex((producto)=>(producto.id===productId))
        if(indice != -1){
            cart.products[indice].quantity = quantity
        }else{
            cart.products.push({id_prod: productId, quantity: quantity})
       }
       const mensaje = await cartModel.findByAndUpdate(cartId,cart)
       res.status(200).send(data)
    } catch(e){
           console.log(e)
           res.status(500).send({message: e.message});
       }
   }
)

export default cartRouter