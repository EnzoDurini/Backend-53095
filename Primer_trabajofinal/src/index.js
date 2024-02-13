import express from 'express'
import productsRouter from './config/ProductManager.js'
import cartRouter from './routes/cartRouter.js'
import upload from './config/multer.js'
import {__dirname} from './path.js'


const app = expres()
const port = 3001

app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))


app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})

app.listen(port, () => {
    console.log(`server on port ${port}`)
}) 