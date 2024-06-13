import productModel from "../models/product.js"

export const getProducts = async(req,res) => {
    try {
        const {limit,page,filter,ord} = req.query;
        let melFilter;
        const pag= page !== undefined?page:1;
        const lim = limit !== undefined?limit:10;
        if(filter=="true" || filter == "false"){
            metFilter = "status"
        }else{
            if(filter !==undefined)
                melFilter = "category";
        }
        const query= metFilter != undefined?{[melFilter]:filter}:{};
        const ordQuery = ord !== undefined?{price:ord}:{};

        const prods = await productModel.paginate(query,{limit:lim,page:pag,sort:ordQuery});

        res.status(200).send(prods)
    } catch (error) {
        res.status(500).render(`Error try to consult products: ${error}`)
    }
}

export const getProduct = async(req,res)=>
    {
        try {
            const idProd = req.params.pid
            const prod = await productModel.findById(idProd)
            if(prod){
                res.status(200).send(prod)
                }else{
                    res.status(404).send({message:"Product not found"})
                    }
        } catch (error) {
            res.status(500).send(`Error try to consult product: ${error}` )
        }
    }

export const createProduct = async (req,res) => {
    try {
        if(req.user.rol == "Admin"){
            const prod = req.body
            const mens =  await productModel.create(prod)
            res.status(201).send(mens)
        }else{
            res.status(403).send({message:"You don't have permission to create products" })
        }
    } catch (error) {
        res.status(500).send(`Internal server error when creating product: ${error}`)
    }
}

export const updateProduct = async (req,res) => {
    try {
        if(req.user.rol == "Admin"){
            const idProd = req.params.pid
            const  updateProd=  req.body
            const prod = await productModel.findByIdAndUpdate(idProd, updateProd)
            res.status(201).send(prod)
        }else{
            res.status(403).send({message:"You don't have permission to update products" })
        }
    } catch (error) {
        res.status(500).send(`Internal server error when updating product: ${error}`)
    }
}

export const deleteProduct = async (req,res) => {
    try {
        if(req.user.rol == "Admin"){
            const idProd = req.params.pid
            const  updateProd=  req.body
            const menssage = await productModel.findByIdAndDelete(idProd)
            res.status(201).send(menssage)
        }else{
            res.status(403).send({message:"You don't have permission to delete products" })
        }
    } catch (error) {
        res.status(500).send(`Internal server error when deleting product: ${error}`)
    }
}
