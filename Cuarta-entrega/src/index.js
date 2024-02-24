import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import chatRouter from  './routes/chatRouter.js'
import upload from './config/multer.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import {__dirname} from './path.js'


const app = express()
const port = 3001

const server = app.listen(port, () => console.log(`Server is running on port ${port}`))

const io = new Server(server)


app.use(express.json())
app.use('/static', express.static(__dirname + '/public'))
// Handlebars setup
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const mensaje = []
io.on('connection', socket => {
    console.log("conectado")
    socket.on('mensaje',info =>{
        console.log(info)
        mensaje.push(info)
        io.emit('mensajes', mensaje)
    })
    })



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