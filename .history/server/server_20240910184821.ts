import {app} from './app'
import dotenv from 'dotenv'


app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.}`)
})