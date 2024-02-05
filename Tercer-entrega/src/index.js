import expres from 'express'
import {ProductManager} from './config/ProductManager.js'


const app = expres()
const port = 3001
const productManager = new ProductManager('./Tercer-entrega/src/data/products.json')

app.get ('/', (req,res)=>{
    res.send("Hola,desde express")
})

app.get('/products', async (req,res)=>{
    const {limit} = req.query

    const prods = await productManager.getProducts()
    const prodsLimit =  parseInt(limit) ? prods.slice(0, limit) : prods
    res.send(prodsLimit)
})

app.get('/products/:pid', async (req,res)=>{
    const idProd = req.params.pid
    const prod = await productManager.getProductsById(idProd)
    res.send(prod)
})

app.listen(port, () => {
    console.log(`server on port ${port}`)
}) 