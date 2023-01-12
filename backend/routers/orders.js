const express=require('express');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const { Product } = require('../models/product');
const router = express.Router();

router.get('/',async(req,res)=>{
    const orderList = await Order.find().populate("user","name").sort({"dateOrdered":-1});

    if(!orderList){
        res.status(500).json({success:false})
    }
    res.send(orderList);
})

router.get('/:id',async(req,res)=>{
    const orderList = await Order.findById(req.params.id)
    .populate("user","name")
    .populate({path:'orderItems',populate:{path:'product',populate:'category'}});

    if(!orderList){
        res.status(500).json({success:false})
    }
    res.send(orderList);
})

router.post('/',async(req,res)=>{
    
    const orderItemsIds= await Promise.all(req.body.orderItems.map( async orderItem=>{
        let newOrderItem=  new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })

        newOrderItem = await newOrderItem.save();
        return  newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved);
  
    const totalPrices =await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
       
        const orderItem= await OrderItem.findById(orderItemId).populate('product','price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }))

    const totalPrice = totalPrices.reduce((a,b)=>a + b, 0);
    console.log(totalPrice);
  
    let order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        user:req.body.user,
    });
     order= await order.save();


    if(!order){
        res.status(500).json({message:"order not save"})
    }

    res.send(order);
})

router.post('/',async(req,res)=>{
    
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status,
        },{
            new:true,
        }
    )

    if(!order){
        res.status(500).json({message:"order not save"})
    }

    res.send(order);
})


router.delete("/:id",(req,res)=>{
    Order.findByIdAndDelete(req.params.id).then((order)=>{
    if(order){
        return res.status(200).json({sucess:true , message:'the order deleted'})
    }else{
        return res.status(404).json({success:'order not find'})
    }
    }).catch(err=>{
        return res.status(400).json({err:err})
    })
})

router.get('/get/totalsales',async(req,res)=>{
    const totalSales  = await Order.aggregate([
        {$group:{_id:null,totalSales:{$sum:'$totalPrice'}}}
    ]);

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be genarated');
    }

    res.send({totasales:totalSales.pop().totalSales})

})


router.get('/get/count',async(req,res)=>{
    const userCount = await Order.countDocuments({})

    if(!userCount){
        return res.status(500).json({message:"not orders creteate"});
    }


    return res.json({orderCount:userCount})

})

router.get('/get/userorders/:userid',async(req,res)=>{
    const userOrderList = await Order.find({user:req.params.userid})
    .populate({path:'orderItems',populate:{path:'product',populate:'category'}})
    .sort({'dataOrdered':-1});

    if(!userOrderList){
        res.status(500).json({success:false})
    }
    res.send(userOrderList);
})

module.exports=router;