const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    object: {
        type: String,
        required: true,
        //unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports= Message = mongoose.model('message',UserSchema);