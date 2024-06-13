import express from 'express'
import messageModel from './models/messages.js'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import indexRouter from './routes/indexRouter.js'
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
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


   //Routes
app.use('/', indexRouter)


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











