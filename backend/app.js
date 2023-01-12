const express = require('express');
const dotenv=require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000
const api= process.env.API_URL

//middlewares
app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());
app.use(errorHandler)
// app.use(authJwt)


//Routers
const categoriesRoutes = require('./routers/categories');
const usersRoutes = require('./routers/users');
const orderRoutes = require('./routers/orders');
const productRouter=require('./routers/products');


app.use(`${api}/categories`,categoriesRoutes)
app.use(`${api}/orders`,orderRoutes)
app.use(`${api}/products`,productRouter)
app.use(`${api}/users`,usersRoutes)


mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log("Database Connection is ready....")
}).catch((error)=>console.log(error))

app.listen(PORT,()=>{
    console.log(api);
    console.log(` server is running in ${PORT}`)
})