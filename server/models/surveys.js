let mongoose = require('mongoose');

let Survey = mongoose.Schema({
  //Author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  Author: String,
  Title: String,
  MCQuestions: [String],
  TFQuestions:[String],
  Created: Date,
  //Expiry: Date,
  Active: Boolean,
  //StartDate: Date,
  //EndDate: Date,
},
{
collection: "surveys"
});

module.exports = mongoose.model('Survey', Survey);

