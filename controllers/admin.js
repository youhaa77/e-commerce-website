const mongodb = require('mongodb');
const Product = require('../models/product');



exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false,
    isAuthenticated:req.session.isLoggedIn
  });
};


exports.postAddProduct = (req, res, next) => { 
   console.log("asaasassa  ")
  const title = req.body.title;
  //must req.file to get the image
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userid =req.user._id
  console.log("imageee   "+ image);
  const imageUrl=image.path

  const product=new Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:userid})
  product.save().then(result =>{
    res.redirect('admin/products')
  }).catch(err=>{
    const error=new Error(err);
    return next(error);
  })
  
};

exports.postEditProduct = (req, res, next) => {
          console.log(req.body.title)
          const prodId=req.body.productId
          const updatedTitle=req.body.title
          const updatedPrice=req.body.price
          const updatedImage=req.file
          const updatedDescription=req.body.description
          Product.findById(prodId).then(result =>{
          result.title=updatedTitle;
          result.price=updatedPrice;
          if(updatedImage){
            result.imageUrl=updatedImage;
          }
            result.description=updatedDescription;
            result.save();
            res.redirect('admin/products')
          }).catch(err=>{
          const error=new Error(err);
          return next(error);
          })

}

exports.postDeleteProduct = (req, res, next) => {
const prodId=req.body.productId
Product.findByIdAndRemove(prodId).then(result =>{
res.redirect('/')
}).catch(err =>{
  const error=new Error('laaa')
  return next(error)
});

}


exports.getEditProduct = (req, res, next) => {
  const prodId=req.params.productId;
   Product.findById(prodId).then(product=>{
    if(product){
    res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    product:product,
    editing:true,
      isAuthenticated:req.session.isLoggedIn
  })};
}).catch(err =>{
  const error=new Error('laaa')
  return next(error)
})
};

exports.getProducts = (req, res, next) => {
  const userId=req.session.user._id
  Product.find({userId:userId}).then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated:req.session.isLoggedIn
    });
  }).catch(err =>{
  const error=new Error('laaa')
  return next(error)
});
};




