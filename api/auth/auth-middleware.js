const User = require('../jokes/jokes-model')

const checkUserNameFree = async (req, res, next)=> {
    try{
        const[user] = await User.findBy({username: req.body.username})
        if(user){
            res.status(401).json({message:"username taken"})
        } else {
            req.user = user
            next()
        }
    }catch(error){
        next(error)
    }
}
const checkUserNameExists = async (req, res, next)=> {
    try{
        const [user] = await User.findBy({username: req.body.username})
        if(user) {
            req.user = user
            next()
        } else {
            res.json({message:  "invalid credentials"})
        }
    }catch (error){
        next(error)
    }
}

const validatePayload = async (req, res, next) => {
    const {username, password} = req.body
    try{
        if(!username || !password){
            res.status(401).json({message: "missing username or password"})
        } else {
            next()
        }
    }catch(error){
        next(error)
    }
}
module.exports ={
    checkUserNameFree,
    checkUserNameExists,
    validatePayload
}