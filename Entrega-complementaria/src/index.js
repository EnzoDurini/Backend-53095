import express from 'express'
import productsRouter from './routes/productsRouter.js'
import cartRouter from './routes/cartRouter.js'
import chatRouter from  './routes/chatRouter.js'
import userRouter from './routes/userRouter.js'
import messageModel from './models/messages.js'
import upload from './config/multer.js'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import {__dirname} from './path.js'



const app = express()
const port = 8080

const server = app.listen(port, () => console.log(`Server is running on port ${port}`))

const io = new Server(server)

//Conexión DB
mongoose.connect("mongodb+srv://admin:coderhouse@cluster0.ioxlwmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("DB is connected"))
.catch(e => console.log(e))


    //Middlewares

app.use(express.json())

            // Handlebars setup
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


io.on('connection',  (socket) => {
    console.log("conectado")
    socket.on('mensaje', async (message) =>{
        try {
            await messageModel.create(message)
            const  messages = await messageModel.getMessages()
            io.emit('mensajes', messages)
        } catch (error) {
            io.emit('error', error)
        }
        
    })
    })


//Routes
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', productsRouter, express.static(__dirname + '/public'))
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
app.use('/api/users', userRouter)



app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.status(500).send("Error al cargar imagen")
    }
})





