import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import messageModel from './models/messages.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import indexRouter from './routes/indexRouter.js'
import {__dirname} from './path.js'


const app = express()
const port = 8080

const server = app.listen(port, () => 
console.log(`Server is running on port ${port}`))

const io = new Server(server)

    //Conexión DB
mongoose.connect("mongodb+srv://admin:coderhouse@cluster0.ioxlwmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>console.log("DB is connected"))
.catch(e => console.log(e))


    //Middlewares

app.use(express.json())
app.use(cookieParser("secretKey"))


app.use(session({
    secret: "secret",
    resave: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:coderhouse@cluster0.ioxlwmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 60*15
    }),
    saveUninitialized:true
}))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


   //Routes
app.use('/', indexRouter)


//Routes Cookies
app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es una cookie :)', { maxAge: 3000000, signed: true }).send("Cookie creada")
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})

app.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieCookie').send("Cookie eliminada")
})

//Session Routes

app.get('/session', (req, res) => {
    console.log(req.session)
    if (req.session.counter) {
        req.session.counter++
        res.send(`You are the user N° ${req.session.counter} `)
    } else {
        req.session.counter = 1
        res.send("You are the First thank you")
    }
})

io.on('connection',  (socket) => {
    console.log("conected")
    socket.on('message', async (message) =>{
        try {
            await messageModel.create(message)
            const  messages = await messageModel.getMessages()
            io.emit('messages', messages)
        } catch (error) {
            io.emit('error', error)
        }
        
    })
    })











