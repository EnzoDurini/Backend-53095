import { Router } from "express";
import { userModel } from "../models/user";

const sessionRouter = Router()


sessionRouter.get('/login', async (req,res) => {
    const {email, password} = req.body

    try{
        const user = await userModel.findOne({email: email}).lean()
        if(user && password == user.password){
            req.session.email = email
            if(user.rol ===  'admin'){
                req.session.admin= true
                req.status(200).send('Admin Logged in')
            }else{
                req.status(200).send('Logged in')
            }
        }else{
            res.status(401).send( 'Invalid Username or Password' )
        }
    }
    catch(e){
        res.status(500).send('Error at login', e)
    }})

sessionRouter.post('/register', async (req,res) =>{
        try {
            const { first_name, last_name, email,password, age} = req.body 
            const findUser = await userModel.findOne({email : email }) 
            if (findUser) { 
                res.status(400).send("Email already exists")
            } else {
                    await userModel.create({first_name ,last_name , email , password ,age, rol:'user'})
                    res.status(200).send("User created")
                }
        } catch (error) {
            res.status.send("Error to create user:", error)
        }
    })

sessionRouter.get( '/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.status(200).redirect('/')
    })

});

    export default sessionRouter