import express from 'express'

const router = express.Router();

router.get('/test',(req,res)=>{
    res.send(
        "I am just checking buddy"
    )
})

export default router;