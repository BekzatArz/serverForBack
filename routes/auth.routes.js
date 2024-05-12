const Router = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = new Router()
const {check, validationResult} = require('express-validator')
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

router.post('/registration', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter that 25').isLength({min: 3, max: 25})

    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Uncorrect request', errors})
        }
        
        const {email, password} = req.body

        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json({message: `User with email ${email} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email, password: hashPassword})
        await user.save()
        await fileService.createDir(new File({user: user.id, name: ''}))
        return res.json({message: 'User was created'})
    } catch (err) {
        console.log(err)
        res.send({message: 'server error'})
    }
})

router.post('/login', 
    async (req, res) => {
    try {
       
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user){
            return res.status(404).json({message: `User with email ${email} not found`})
        }
        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid){
            return res.status(400).json({message: `Invalid password`})
        }
        const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        })

    } catch (err) {
        console.log(err)
        res.send({message: 'server error'})
    }
})
router.get('/auth', authMiddleware,
    async (req, res) => {
    try {
       
       const user = await User.findOne({_id: req.user.id})
       const token = jwt.sign({id: user.id}, config.get('secretKey'), {expiresIn: '1h'})
       return res.json({
           token,
           user: {
               id: user.id,
               email: user.email
           }
       })

    } catch (err) {
        console.log(err)
        res.send({message: 'server error'})
    }
})


module.exports = router