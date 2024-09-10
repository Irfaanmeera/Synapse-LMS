import {app} from './app'
import dotenv from 'dotenv'
im
dotenv.config()

app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.PORT}`)
    connect
})