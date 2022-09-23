const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
    object:{
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    messaging_product: {
        type: String,
        required: true
    },
    display_phone_number: {
        type: String,
        required: true
    },
    phone_number_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    wa_id: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    }
});

module.exports =Messages= mongoose.model('messages', MsgSchema);
