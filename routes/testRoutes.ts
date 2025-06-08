import express from 'express'
import {resetSystem} from '../controllers/testController'

const router = express.Router()

router.post('/reset', resetSystem)

export default router