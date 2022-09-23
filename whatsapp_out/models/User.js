const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    //mobile number
    mobileno:{
        type: Number,
        required: true
    },
    //whatsapp business app id
    wabappid: {
        type: String,
        required: true,
        //unique: true
    },
    //permanent access token
    accesstoken: {
        type: String,
        required: true
    },
    //password
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports= User = mongoose.model('Business User',UserSchema);