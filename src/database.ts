import {Pool} from "pg"
import User from "./domain/user.js"

const dbHost = process.env.DB_HOST
const pool = new Pool({
    connectionString:dbHost
})
const client = await pool.connect()

pool.on("error",(err)=>{
    throw err
})

process.on("SIGINT",()=>{
    pool.end()
    console.log("pool disconnected")
})

class UserManager{

    //post 
    static async setUsername(username:string,email:string):Promise<boolean>{ 
        let res = await client.query("UPDATE \"Userdata\" SET username=$1 WHERE email=$2",[username,email])
        return res.rowCount != 0
    }
    static async setCash(username:string,cash:number):Promise<boolean>{ 
        let res = await client.query("UPDATE \"Userdata\" SET cash=$1 WHERE username=$2",[cash,username])
        return res.rowCount != 0
    }

    //get
    static async usernameExists(username:string):Promise<boolean>{
        let res = await client.query("SELECT username FROM \"Userdata\" WHERE username=$1",[username])
        return res.rows.length != 0
    }
    static async emailExists(email:string):Promise<boolean>{
        let res = await client.query("SELECT email FROM \"Userdata\" WHERE email=$1",[email])
        return res.rows.length != 0
    }
    static async getDataByUsername(username:string):Promise<{username:string,email:string,cash:number}|null>{
        let res = await client.query("SELECT username,cash FROM \"Userdata\" WHERE username=$1",[username])
        if (res.rows.length == 0)
            return null
        return {username:username,email:res.rows[0].email,cash:res.rows[0].cash}
    } 
    static async getDataByEmail(email:string):Promise<{username:string,email:string,cash:number}|null>{
        let res = await client.query("SELECT username,cash FROM \"Userdata\" WHERE email=$1",[email])
        if (res.rows.length == 0)
            return null
        return {username:res.rows[0].username,email:email,cash:res.rows[0].cash}
    } 
    //put
    static async addUser(username:string,email:string,cash:number = 0):Promise<boolean>{
        let res = await client.query("INSERT INTO \"Userdata\" (username,email,cash) VALUES ($1,$2,$3)",[username,email,cash])
        return res.rowCount != 0
    }
}

export {UserManager}