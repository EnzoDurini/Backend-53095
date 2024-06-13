import { Router } from "express";
import { userModel } from "../models/user";
import passport from 'passport';



const sessionRouter = Router()


sessionRouter.get('/login', passport.authenticate('login'), async (req,res) => {
    try{
        if(!req.user){
            return res.status(401).send("Not logged in")
        }
        req.session.user = {
            email: req.user.email, 
            first_name: req.user.first_name
        }
        res.status(200).send('User logged in')
        }catch(err){
            res.status(500).send(err);
        }})

sessionRouter.post('/register', passport.authenticate('register'), async (req,res) =>{
        try {
            if(!req.user){
                return res.status(400).send('User can not registered')
                }
            res.status(200).send('New User Created');
        } catch (error) {
            res.status.send("Error to create user:", error)
        }
    })

sessionRouter.get('/github', passport.authenticate('github', {scope : ['user:email']}), async(req,res) =>{})

sessionRouter.get('/githubSession',  passport.authenticate('github'), async(req,res)=>{
    req.session.user ={
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/api/products')
})


sessionRouter.get( '/logout', (req, res)=>{
    req.session.destroy(function(e){
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }
    })

});

    export default sessionRouter