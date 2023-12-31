const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.fola = (req,res,next) =>{
  console.log("wslnaaa");
  Product.find().then(result=>{
    console.log("hnaaa");
    res.status(201).json(result);
  })
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err =>{
      const error=new Error('laaa')
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
          isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err =>{
      const error=new Error('laaa')
      return next(error)
    })
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
          isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err =>{
    const error=new Error('laaa')
    return next(error)
    })
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
          isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err =>{
  const error=new Error('laaa')
  return next(error)
})
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const itemsNew=[...req.user.cart.items]
  const Index=itemsNew.findIndex(result=>{return result.productId.toString() === prodId.toString()
   // console.log(result.productId.toString() === prodId.toString())
  })
  itemsNew.splice(Index, 1);
  const cartNew={items:itemsNew}
 // console.log("booof "+itemsNew)
  User.updateOne({_id:req.user._id},{cart:cartNew}).then(reult =>{res.redirect('/')})
  
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

