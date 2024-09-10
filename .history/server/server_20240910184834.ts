import {app} from './app'
import dotenv from 'dotenv'
dot


app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.PORT}`)
})