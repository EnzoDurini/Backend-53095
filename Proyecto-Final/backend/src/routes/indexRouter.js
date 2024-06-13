import cartRouter from './cartRouter.js'
import productRouter from './productRouter.js'
import userRouter from './userRouter.js'
import chatRouter from './orderRouter.js'
import sessionRouter from './sessionRouter.js'
import express from 'express'
import { __dirname } from '../middleware/auth.js'

const indexRouter = express.Router()

indexRouter.get('/', (req,res) => {
    res.status(200).send("Welcome")
})

indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/upload', multerRouter)
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/chat', chatRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)
