let mongoose = require('mongoose');

// create a model class just with questions 
let Answer = mongoose.Schema({
    SurveyId: {type: mongoose.Schema.Types.ObjectId},
    Author: String,
    Answer: [],
    Create: Date
},
{
  collection: "answers"
});

Answer.index({ SurveyId: 1, Author: 1 });
module.exports = mongoose.model('Answer', Answer);
