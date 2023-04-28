'use strict';

var users = function(userName,emailId,contactNo,password,address,wishList,cart){
    this.userName=userName;
    this.emailId=emailId;
    this.contactNo=contactNo;
    this.password=password;
    this.address=address;
    this.wishList=wishList;
    this.orders=orders;
    this.cart=cart;
}
users.toObject = function(result){
    return new users(result.userName,result.emailId,result.contactNo,result.password,result.address,result.wishList,result.orders,result.cart);
}
module.exports = users;