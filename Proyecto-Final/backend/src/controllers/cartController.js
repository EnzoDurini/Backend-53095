import cartModel from "../models/cart.js";
import productModel from "../models/product.js";
import ticketModel from "../models/ticket.js";


export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findOne({_id:cartId})
        res.status(200).send(cart)
    } catch (error) {
        res.status(500).render(`Internal error querying cart: ${error}`)
    }
}

export const createCart = async (req,res) => {
    try {
        const menssage = await cartModel.create({ products: []})
        res.status(201).send(menssage)
    } catch (error) {
        res.status(500).render(`Internal error creating cart: ${error}`)
    }
}

export const createTicket = async (req, res) => {
    try {
        console.log(req.user)
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)
        const prodSinStock = []
        if(cart){
            cart.products.forEach( async (prod) => {
                let product = await productModel.findById(prod.id_prod)
                if(product.stock - prod.quantity < 0){
                    prodSinStock.push(product.id)
                }
        })
        if(prodSinStock.length == 0){
            const totalPrice = cart.products.reduce((a, b) => (a.id_prod.price * a.quantity) + (b.id_prod.price * b.quantity), 0)
            console.log(cart.products)
            const aux = [...cart.products]
            const newTicket = await ticketModel.create({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: 5,
                products: cart.products
            })
            cart.products.forEach(async(prod) =>{
                await cartModel.findByIdAndUpdate(cartId,{products:[]})
            })
            res.status(201).send(newTicket)
            }else{
                prodSinStock.forEach((prodId)=>{
                    cart.products = cart.products.filter(pro => pro.id_prod !== prodId)  
                })
                await cartModel.findByIdAndUpdate(cartId,{products: cart.products})
                res.status(400).send(`Productos sin stock: ${prodSinStock}`)
            }
        }else{
            res.status(404).send(`No existe el carrito con id: ${cartId}`)
        }  
    } catch (error) {
        res.status(500).send(`Internal error creating ticket: ${error}`)
        
    }
}

export const insertProductCart = async (req,res) => {
    try {
        if(req.user.rol == "Admin"){
            const cartId = req.params.cid
        const prodId = req.params.pid
        const {quantity} = req.body
        const cart = await cartModel.findById(cartId)
        const ind = cart.products.findIndex(p => p.id_prod == prodId)
        if(ind == -1){
            cart.products[ind].quantity += quantity
            } else {
                cart.products.push({id_prod: prodId, quantity: quantity})
                }
        const menssage = await cartModel.findByIdAndUpdate(cartId,cart)
        res.status(200).send(menssage)
        }else{
            res.status(403).send("No autorizado")
        }           
    } catch (error) {
        res.status(500).render(`Internal error adding product: ${error}`)
    }
}