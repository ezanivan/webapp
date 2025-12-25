import Express from "express"
import http from "http"

const PORT = 8080
let app = Express()

const server = http.createServer(app)

app.get("/",(req,res)=>{
    res.send("ok")
})

server.listen(8080,()=>{
    console.log(`server started at ${PORT}`)
})

process.on("SIGINT",()=>{
    server.close()
    console.log("proccess terminated and server closed")
    process.exit()
})