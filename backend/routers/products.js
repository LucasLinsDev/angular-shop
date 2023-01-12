const { Category } = require('../models/category');
const { Product } = require('../models/product');

const router = require('express').Router();
const multer =require('multer');
const mongoose=require("mongoose");

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const isValid=FILE_TYPE_MAP[file.mimetype]

        if(isValid){
            uploadError=null;
        }
        cb(null,'public/uploads')
    },
    filename: function(req,file,cb){
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null,`${fileName}-${Date.now()}.${extension}`);
    }
})

const uploadOptions = multer({storage:storage})

router.get('/',async(req,res)=>{
    // const productList  = await Product.find().select("name");
    let filter={}
    if(req.query.categories){
         filter={ category: req.query.categories.split(',')}
    }


     const productList  = await Product.find(filter).populate("category");

    if(!productList){
        res.status(500).json({success:false})
    }

    res.send(productList);

})


router.get('/:id',async(req,res)=>{
    
    const product  = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(500).json({success:false})
    }

    res.send(product);

});


router.post('/', uploadOptions.single('image') ,async (req,res)=>{
    
    console.log(req.body);
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("Invalid Category");


    const file = req.file;
    if(!file) return res.status(400).send("No image in the request");

    const fileName=req.file.filename;
    const basePath=`${req.protocol}://${req.get('host')}//public/upload/`
    let product = new Product({
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:`${basePath}${fileName}`,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatures:req.body.isFeatures
    });

    product = await product.save();

    if(!product){
        return res.status(500);
    }

    product.save().then((createProduct=>{

        res.status(201).json(createProduct);

    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false,
        })
    })

})


router.put('/:id',uploadOptions.single("image"), async (req,res)=>{

    if(mongoose.isValidObjectId(req.params.id)){
        res.status(400).send("Invalid Product ID");
    }

    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("Invalid Category");


    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send("Invalid category");

    const file = req.file;
    let imagepath;

    if(file){
        const fileName=req.file.filename;
        const basePath=`${req.protocol}://${req.get('host')}//public/upload/`
        imagepath=`${basePath}${fileName}`
    }else{
        imagepath=product.image;
    }
    let updatedproduct = new Product.findByIdAndUpdate(req.params.id,{
        
        name: req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:imagepath,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatures:req.body.isFeatures
    },
    {new:true}
    );

  

    updatedproduct.save().then((createProduct=>{

        res.status(201).json(createProduct);

    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false,
        })
    })

})


router.delete('/:id',(req,res)=>{
    Product.findByIdAndDelete(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({sucess:true,message:"the product is deleted"})
        }else{
            return res.status(404).json({success:false,message:"product not deleted"})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
})


router.get('/get/count',async (req,res)=>{
    const productCount = await Product.countDocuments((count)=>count);

if(!productCount){
    res.status(500).json({success:false})
}

res.send({
    count:productCount
})


})


router.get('/get/featured',async (req,res)=>{
    const products = await Product.find({isFeatured:true})

    if(!products){
        res.status(500).json({success:false})
    }
    res.send(products)
})


router.get(`/get/featured/:count`, async (req,res)=>{
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured:true}).limit(+count);

    if(!products){
        res.status(500).json({success:false})
    }
    res.send(products);
})


module.exports=router