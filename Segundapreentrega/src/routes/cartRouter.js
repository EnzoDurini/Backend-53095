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
        const cart = await cartModel.findOne({_id: cartId}) 
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

cartRouter.delete('api/carts/:cid/produtcs/:pid', async(req,res)=>{
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    try{
        const cart = await cartModel.findById(cartId);
        const index = cart.products.indexOf(prodId);
        
        if(index >-1){
                cart.products.splice(index,1);
        } else {
            return res.status(400).send({message:'El producto no se encuentra en el carrito'})
        }
        await cart.save();
        res.status(200).send(cart);
    }catch(err){
        console.log(err);
        res.status(500).send({message:"Error al eliminar del carrito"})
    }
    
})
cartRouter.delete('api/carts/:cid', async(req,res)=> {
    const cartId = req.params.cid
    try{
        const data=await cartModel.deleteCart(cartId)
        if(!data)
            return  res.status(400).send({message:'No se ha podido borrar el carrito'})
        res.status(200).send(data)
    }catch(err){
        console.log(err)
        res.status(500).send({message:'Error interno de servidor'})
    }
})

cartRouter.put('api/carts/:cid', async(req,res)=>{
    const cartId = req.params.cid
    const update = req.body
    let cart = await cartModel.findByIdAndUpdate(cartId ,update,{new:true}).populate("products")
    res.status(200).send(cart)
})

cartRouter.put('api/carts/:cid/products/:pid', async(req,res) =>{
    const cartId = req.params.cid
    const prodId = req.params.pid
    const itemUpdates = req.body;
    //buscar si el producto existe en el carrito y hacer la actualizacion correspondiente
    let cart = await cartModel.findById(cartId)
    let index = cart.products.findIndex(prod=>prod.id == prodId)
    if (index < 0 ) {
        return res.status(400).send({message:'El producto no se encuentra en este carrito.'});
    }else{
        itemUpdates.quantity = Math.abs(itemUpdates.quantity)
        cart.products[index] = await cart.products[index].update(itemUpdates)
        await cart.save()
        res.status(201).send(cart.products[index])
    }
})
export default cartRouter