import {Pool} from "pg"


const dbHost = process.env.DB_HOST
const pool = new Pool({
    connectionString:dbHost
})
const client = await pool.connect()
console.log("database connected")

pool.on("error",(err)=>{
    throw err
})

process.on("SIGINT",()=>{
    pool.end()
    console.log("database disconnected")
})

async function test(id:number):Promise<any>{
    let res = await client.query("SELECT id,username,email FROM userdata WHERE id=$1::int4",[id])
    return res.rows[0]
}

export {test}
