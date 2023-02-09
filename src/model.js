const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const plot = new Schema({
    sales:Number,
    year:Number
});

module.exports = mongoose.model('plot', plot);