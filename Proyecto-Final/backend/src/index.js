import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import messageModel from './models/messages.js'
import indexRouter from './routes/indexRouter.js'
import initializePassport from './config/passport/passport.js'
import { Server } from 'socket.io'
import {engine} from 'express-handlebars'
import { __dirname } from './path.js'

//Configuraciones
const app = express()
const PORT = 8080

//Server
const server = app.listen(PORT, () => { console.log(`Server on port ${PORT}`)})
const io = new Server(server)

//Middlewares
mongoose.connect("")
        .then(()=> console.log("DB is connected"))
        .catch((err)=> console.log(err))

app.use(session({
    secret: 'passwordxd',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: '' , ttl: 60*60})
}))        

app.use(cookieParser("clave"))
app.use('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//Routes

app.use('/', indexRouter)

//Cookies Routes 
app.get('/setCookie', (req, res) => {
    res.cookie('galletita', 'Esto es una cookie :)',{maxAge:3000000, signed:true}).send("Cookie creada")
    })

app.get('/getCookie'), (req, res) =>{
    res.send(req.signedCookies)
}
app.delete('/deleteCookie', (req,res)=>{
    res.clearCookie('galletita').send("Cookie eliminada")
})

//Session Routes
app.get('/setSession', (req, res) => {
    if(req.session.counter){
        req.session.counter++
        res.send(`Session counter: ${req.session.counter}`)
    }else{
        req.session.counter = 1
        res.send('Session counter: 1')
    }
})

app.post('/login', (req,res) =>{
    const{email,password} = req.body
    if(email == "admin@admin.com" && password === "123456"){
        req.session.email = email
        req.session.password = password
    }
    res.send('Login')
})

io.on('connection', (socket) => {
    console.log("Conexion con Socket.io")

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (e) {
            io.emit('mensajeLogs', e)
        }

    })

})