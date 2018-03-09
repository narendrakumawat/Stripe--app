/**
 * Created by nkkumawat  on 9-MAR-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;
const userSchema = new Schema({
    name : { type : String, required : true },
    password : { type : String, required : true },
    email : { type : String, required : true, index : true }
});

module.exports = mongoose.model('User', userSchema);