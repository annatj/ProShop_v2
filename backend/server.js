import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'
import connectDB from './config/db.js';
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import razorpay from 'razorpay'
import { updateOrderToPaid } from './controllers/orderController.js';
import {protect} from './middleware/authMiddleware.js'
dotenv.config();

const port = process.env.PORT || 5000
connectDB(); //connect to MongoDB
const app = express();
app.use(bodyParser.json());


//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookie parser middleware
app.use(cookieParser());


app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);

// initialize razorpay
const rzp = new razorpay({
    key_id:process.env.RAZORPAY_ID_KEY,
    key_secret:process.env.RAZORPAY_SECRET_KEY
});

//create an api endpoint for creating orders

app.post('/api/orders/:id/razorpay',protect,async(req,res)=>{
    
     try{
    const { totalPrice } = req.body;
    // console.log('totalprice',totalPrice);

    const amount = totalPrice*100;
    console.log(amount)
    console.log(typeof amount)
    const orderData = {
        amount:amount,
        currency:'INR',
        receipt: 'razorUser@gmail.com'

    };
    

    rzp.orders.create(orderData,(err,order)=>{
        if(!err){
            res.status(200).send({
                success:true,
                msg:'Order Created',
                order_id:order.id,
                amount:amount,
                key_id:process.env.RAZORPAY_ID_KEY,
                currency:'INR',
                contact:"8567345632",
                name: "Anna Joy",
                email: "anna@gmail.com"
            });
           
        }
        else{
            res.status(400).send({success:false,msg:'Something went wrong!'});
        }
    })
}catch(error){
    console.log(error.message);
}

}).put('/api/orders/:id/razorpay',protect,updateOrderToPaid);



app.get('/api/config/paypal',(req,res) => res.send({clientId:process.env.PAYPAL_CLIENT_ID}));

const __dirname = path.resolve(); // set __dirname to current directory
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

if(process.env.NODE_ENV === 'production'){
    //set static folder

    app.use(express.static(path.join(__dirname,'/frontend/build')));


    //any route that is not api will be redirected to index.html

    app.get('*',(req,res) =>
           res.sendFile(path.resolve(__dirname,'frontend','build','index.html')));
}else{
    app.get('/',(req,res)=>{
        res.send('API is running..');
    });

}

app.use(notFound);
app.use(errorHandler);



app.listen(port,()=>console.log(`Server running on port ${port}`))