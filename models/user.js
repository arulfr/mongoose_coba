const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[{
            productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
            quantity:{type:Number,required:true}
        }] 
    }
});


userSchema.methods.addToCart = function(product){
      const cartProdukIndex = this.cart?.items.findIndex((cp) =>{
        return cp.productId.toString() === product._id.toString();
      });

      let newQuantity = 1;
      const updatedCartItems = [...this.cart?.items];
       if(cartProdukIndex >= 0){
        newQuantity = this.cart.items[cartProdukIndex].quantity + 1;
        updatedCartItems[cartProdukIndex].quantity = newQuantity;
       }else{
        updatedCartItems.push({
          productId : product._id,
          quantity : newQuantity
        });
       }

       const updatedCart = {
        items: updatedCartItems
       }

       this.cart = updatedCart;

       return this.save()


      // const updateCart = {items:[{productId: new ObjectId(product._id),quantity:1}]};
    //   const db = getDb();
    //   return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set:{cart:updatedCart}});

}


userSchema.methods.deleteItemFromCart = function(productId){
        const updatedCartItems = this.cart.items.filter(i=>{
          return i.productId.toString() !== productId.toString()
        });

        this.cart.items = updatedCartItems;
        return this.save();
}


userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save(); 
}


module.exports = mongoose.model('User',userSchema);

// const {getDb} = require('../util/database');
// const {ObjectId} = require('mongodb');

// class User {
//     constructor(username,email,cart,id){
//       this.username = username;
//       this.email = email;
//       this.cart = cart;
//       this._id = id;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product){

//       const cartProdukIndex = this.cart?.items.findIndex((cp) =>{
//         return cp.productId.toString() === product._id.toString();
//       });

//       let newQuantity = 1;
//       const updatedCartItems = [...this.cart?.items];
//        if(cartProdukIndex >= 0){
//         newQuantity = this.cart.items[cartProdukIndex].quantity + 1;
//         updatedCartItems[cartProdukIndex].quantity = newQuantity;
//        }else{
//         updatedCartItems.push({
//           productId : new ObjectId(product._id),
//           quantity : newQuantity
//         });
//        }

//        const updatedCart = {
//         items: updatedCartItems
//        }


//       // const updateCart = {items:[{productId: new ObjectId(product._id),quantity:1}]};
//       const db = getDb();
//       return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set:{cart:updatedCart}});
//     }

//       getCart() {
//         const db = getDb();
//         const productIds = this.cart?.items?.map(i=>{
//           return i.productId;
//         });

//         return db
//                 .collection('products')
//                 .find({_id:{$in:productIds}})
//                 .toArray()
//                 .then(products =>{
//                   return products.map(p=>{
//                     return {
//                       ...p,
//                       quantity: this.cart.items.find(i=>{
//                         return i.productId.toString() === p._id.toString();
//                       }).quantity
//                     }
//                   });
//                 });
//       }

//       deleteItemFromCart(productId){
//         const updatedCartItems = this.cart.items.filter(i=>{
//           return i.productId.toString() !== productId.toString()
//         });
  
//         const db = getDb();
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set:{cart:{items:updatedCartItems}}});
  
//       }

//     addOrder(){
//         const db = getDb();

//       return this.getCart()
//         .then(products=>{
//           const order = {
//             items:products,
//             user:{
//               _id:new ObjectId(this._id),
//               username:this.username
//             }
//           };
//           return db.collection('orders').insertOne(order);
//         })
//         .then(result=>{
//           this.cart = {items:[]}
//           return db
//           .collection('users')
//           .updateOne({_id:new ObjectId(this._id)},{$set:{cart:{items:[]}}});
//         })
//         .catch((err)=>{console.log(err)});
              
//       }

//       getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({"user._id":this._id}).toArray();
//       }

//     static findById(userId){
//       const db = getDb();
//       return db
//         .collection("users")
//         .findOne({ _id: new ObjectId(userId) })
//         .then((user) => {
//           console.log(user);
//           return user;
//         })
//         .catch((err) => console.log(er));
//     }


// }

// module.exports = User;
