import { Router } from "express";
import productModel from "../models/product.js";


const productsRouter = Router()

productsRouter.get('/', async  (req, res) =>{
    try{
        let metFilter
        const {limit, page, filter, ord} = req.query;
        const pag = page != undefined ? page : 1
        const lim = limit != undefined  ? limit : 5
        
        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }
            
            const query = metFilter ? {[metFilter]: filter}: {}
            const ordQuery = ord !== undefined ? {price : ord}: {}

        const prods = await productModel.paginate(query,{limit:lim, page: pag, sort:ordQuery})
    return res.status(200).send(prods)
    
    }catch(error){
        return res.status(500).render('templates/error', {
            error: error,
        })
    }
})

productsRouter.get('/:pid', async(req,res)=>{
    try{
        const  prodId= req.params.pid;
        const prod =await productModel.findById(prodId);
        if(prod){
            res.status(200).send(prod)
            }else{
                res.status(404).send('Product doesn´t exist');
            }        
    } catch(e){
        res.status(500).send(`Error searching product: ${e}`);
    }
}
)

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        const mensaje = await productModel.create(product);
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
    const message = await productModel.findByIdAndUpdate(idProduct,uProduct)
    if(message=="Actualizado con exito"){
        res.status(200).send(message)
    }else{
        res.status(404).send("No se ha encontrado el producto a actualizar")
    }
   } catch (error) {
    res.status(500).send(`Error interno del servidor en la operacion de actualizacion :${error}`)
   }
} )

productsRouter.delete("/:pid",async (req,res)=>{
try {
    const idP = req.params.pid;
    const message = await productModel.findByIdAndDelete(idP)
    if(message=="Eliminado con Exito"){
       res.status(200).send({message})
       }else{
        res.status(404).send({message});
}} catch (error) {
    res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
});

export default productsRouter;