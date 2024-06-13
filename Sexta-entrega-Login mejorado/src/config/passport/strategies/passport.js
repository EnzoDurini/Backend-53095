import local from 'passport-local'
import passport from 'passport'
import crypto from 'crypto'
import  { userModel } from '../../../models/user.js';
import { createHash, validatePassword } from '../../../utils/bcrypt';
import GithubStrategy from   'github'
const localStrategy = local.Strategy

const initializePassport = () =>{
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req,username,password, done)=>{
            try {
                const { first_name, last_name, email,password, age} = req.body 
                const findUser = await userModel.findOne({email : email }) 
                if (findUser) { 
                    return done(null,false)

                } else {
                        return done(null, true)
                    }
            } catch (error) {
                return done(error)
            }
        }
        ))

        //Inicializar la sesion
        passport.serializeUser((user,done)=> {
            done(null , user._id )
        });
        //Eliminar la sesion
        passport.deserializeUser(async (id , done) => {
            const user = await userModel.findById(id)
            done(null , user);
        })

        passport.use('login', new localStrategy(
            {usernameField: 'email'},
            async(username,password, done)=>{
                try{
                    const user = await userModel.findOne({email: username}).lean()
                    if(user && validatePassword(password, user.password)){
                            return done (null, user);
                    }else{
                        return done (null, false)
                    }
                }
                catch(e){
                    return done (e);
                }
            }
            ))

    passport.use('github', new GithubStrategy({
        clientID : process.env.GITH,
        clientSecret : process.env.SECRET_GITHUB,
        callbackUrl: ""
      }, 
       async (accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({email:profile._json.email}).lean()
            if(user){
              return done(null, user)
            } else{
                const randomNumber = crypto.randomUUID()
                const userCreated = await userModel.create({first_name: profile._json.name,last_name: ' ',
                    email: profile._json.email,age:18,password:createHash(`${profile._json.name}${randomNumber}`)})
                return done(null,userCreated)
                }
        }catch(e){
            return done(e)
        }
    }))


            
}


export default initializePassport