const {Category} = require('../models/category');
const router = require('express').Router();

router.get(`/`,async(req,res)=>{
    const categories=  await Category.find({});

   return res.json(categories);

})

router.get(`/:id`,async(req,res)=>{
    const categories=  await Category.findById(req.params.id);

   return res.json(categories);

})
router.post(`/`, async (req,res)=>{

    let category =  new Category({
        name: req.body.name,
        icon: req.body.icon,
        color:req.body.color
    })

    category = await category.save();

    if(!category){
        return res.status(404).send('The category cannot be created!');
    }

    res.send(category);

})

router.delete("/:id",(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then((category)=>{
    if(category){
        return res.status(200).json({sucess:true , message:'the category deleted'})
    }else{
        return res.status(404).json({success:'category not find'})
    }
    }).catch(err=>{
        return res.status(400).json({err:err})
    })
})

router.put('/:id',async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
        },
        {new:true}
        );

    
        if(!category){
            return res.status(400).send("The category canoot be created")
        }

        res.send(category);
})


module.exports = router;