import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { config } from "dotenv"
config()

const app = express()
app.use(cors())

const server = http.createServer(app)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server listening on ${PORT}`))

