import {Router} from "express"
import {UserManager} from "../database.js"
import User from "../domain/user.js"

let userRouter:Router = Router() 

userRouter.route("/:username")
.get(async (req,res)=>{
    const {username} = req.params 
    const data = await UserManager.getDataByUsername(username)
    if (data == null){
        res.sendStatus(404)
        return
    }
    res.status(200).render("users/profile.ejs",data)
})
.post(async (req,res)=>{
    //TODO check if user owns the account
    let {username} = req.body as {username: string}

    if (username == null){
        return res.status(400).json({error:"invalid request"})
    }

    if (!User.validateUsername(username)){ // validation to check if username doesnt contain invalid characters and matches size 
        return res.status(400).json({error:"invalid username"})
    }

    if (username == req.params.username){
        return res.status(200).json("no changes made")
    }

    if (await UserManager.usernameExists(username)){ // database call to check if username is already in use
        return res.status(409).json({error:"username already exists"})
    }

    const data = await UserManager.getDataByUsername(req.params.username)
    if (data === null){ // in case user chaged request url
        return res.status(404).json({error:"user not found"})
    }

    try{ await UserManager.setUsername(username,data.email) }
    
    catch(err){
        if (err && typeof err === 'object' && 'code' in err){
            if (err.code === "23505"){ return res.status(409).json({error:"username already exists"})} //avoid race conditions, 23505 is postgre error for unique values
        }
        return res.status(500).json({error:"server error"})    
    }

    res.status(200).json({redirect:"/user/".concat(username)})
})
export default userRouter