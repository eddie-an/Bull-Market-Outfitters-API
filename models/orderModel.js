const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id: {
        type: String,
        required: true
    },
    session: {
        type: Object,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    isStockUpdated: {
        type: Boolean,
        required: true
    }
}, { timeseries: true })


module.exports = mongoose.model("order", orderSchema);