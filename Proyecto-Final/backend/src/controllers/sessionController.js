import passport from "passport";


export const login = async (req,res) =>{
    try {
        if(!req.user){
            return res.status(401).send("Invalid username or password")
        }
        req.session.user={
            email: req.user.email,
            first_name: req.user.first_name
        }
        res.status(200).send("Login succesfull")
    } catch (error) {
        res.status(500).send("Login error")
    }
}

export const resgister = async (req,res) =>{
    try {
        if(!req.user){
            return res.status(400).send("Username already exist")
        }
        res.status(200).send("Usuario creado correctamente")
    } catch (error) {
        res.status(500).send("Error creating user")
    }
}

export const logout = async (req,res) =>{
    req.session.destroy(function(e){
        if(e){
            console.log(e)
        }else{
            res.status(200).redirect("/")
        }
    })
}

export const sessionGithub= async (req,res) =>{
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')
}



//Testing
export const testJWT = async (req,res) =>{
    if (req.user.rol == 'User')
        res.status(403).send("Usuario no autorizado")
    else
        res.status(200).send(req.user)

}