import { Router } from "express";
import { ProductManager } from "../config/ProductManager.js";


const productManager = new ProductManager('./Cuarta-entrega/src/data/products.json')

const productsRouter = Router()

productsRouter.get('/', async  (req, res) =>{
    try{
        const {limit} = req.query;
        const prods = await productManager.getProducts()
        let limite = parseInt(limit)
        if(!limite)
        limite = prods.lenght
    const prodsLimit = prods.slice(0,limite)
    return res.status(200).render('templates/home',{
        mostrarProductos: true,
        productos: prodsLimit,

    });
        
    }catch(error){
        return res.status(500).render('templates/error', {
            error: error,
        })
    }
})


productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        console.log(product)
        const mensaje = await productManager.addProduct(product)
        if (mensaje == "Producto cargado correctamente")
            res.status(200).send(mensaje)
        else
            res.status(400).send(mensaje)
    } catch (error) {
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})


productsRouter.put("/:id",async (req,res)=>{
   try {
    const idProduct = req.params.id
    const uProduct = req.body
    const message = await productManager.updateProduct(idProduct,uProduct)
    if(message=="Actualizado con exito"){
        res.status(200).send(message)
    }else{
        res.status(404).send("No se ha encontrado el producto a actualizar")
    }
   } catch (error) {
    res.status(500).send(`Error interno del servidor en la operacion de actualizacion :${error}`)
   }
} )

productsRouter.delete("/:pid",(req,res)=>{
try {
    const idP = req.params.pid;
    const message = productManager.deleteProduct(idP);
    if(message=="Eliminado con Exito"){
       res.status(200).send({message})
       }else{
        res.status(404).send({message});
}} catch (error) {
    res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default productsRouter;