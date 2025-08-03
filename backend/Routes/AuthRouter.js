import express from 'express'
import { currentUser, getallUsers, login, logout, signup } from '../Controller/Authcontroller.js'
import { ensureAuthenticated } from '../Middlewares/Auth.js'


const router = express.Router()

router.post('/login',login)

router.post('/signup', signup)
router.post('/logout', ensureAuthenticated, logout)

router.get('/getuser', ensureAuthenticated, getallUsers)
router.get('/currentuser', ensureAuthenticated, currentUser)

export default router