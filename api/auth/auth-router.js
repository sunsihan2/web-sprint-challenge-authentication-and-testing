const router = require('express').Router();
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
//const restricted = require('../middleware/restricted')
const Jokes = require('../jokes/jokes-model')
const {JWT_SECRET} = require('../../secrets')
const {checkUserNameExists, checkUserNameFree, validatePayload} = require('./auth-middleware')

router.post('/register', validatePayload, checkUserNameFree ,(req, res) => {
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
      // const credentials = req.body
      // if(isValid(credentials)){
      //   const rounds = process.env.BCRYPT_ROUNDS || 8;
      //   const hash = bcryptjs.hashSync(credentials.password, rounds)
      //   credentials.password = hash
      //   Users.add()
      // }
      let user =  req.body
      const hash= bcryptjs.hashSync(user.password, 8)
      user.password = hash
      Jokes.add(user)
        .then(users => {
          return res.status(201).json(users)
        })
        .catch(error => {
          console.log(error)
        })
});

router.post('/login',  validatePayload, checkUserNameExists,(req, res) => {

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
      if(bcryptjs.compareSync(req.body.password, req.user.password)){
        const token = buildToken(req.user)
        res.json({
          message: `welcome, ${req.user.username}`,
          token: token
        })
      } else {
        res.status(401).json({message: "invalid credentials"})
      }
});

function buildToken (user){
  const payload ={
    subject:user.id,
    username: user.username
  }
  const options ={
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}
module.exports = router;
