// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

//Heylisse
let passport = require('passport')
//let surveysControllers = require('../controllers/surveys');

// helper function for guard purposes H
function requireAuth(req, res, next)
{
    // check if the user is logged in H
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
// define the survey model
let survey = require('../models/surveys');
const surveys = require('../models/surveys');

/* GET surveys List page. READ */
router.get('/', (req, res, next) => {
  // find all surveys in the surveys collection
  survey.find( (err, surveys) => {
    if (err) {
      return console.error(err);
    }
    else {
      console.log(surveys)
      res.render('surveys/list', {
        title: 'surveys',
        surveys: surveys,
        displayName: req.user ? req.user.displayName : ''  
      });
    }
  });


//   Define active SURVEY
  router.get('/active', (req, res, next) => {
    /*let selDate = {        
        active: true,
    };
    survey.default.find(selDate, function (err, surveys) {
        if (err) {
            return console.error(err);
        }
        res.render('surveys/active', {
          title: 'Active Survey',
          surveys: ''          
    });
  });
*/

res.render('surveys/active', {
  title: 'Create Survey',
  surveys: '',
  displayName: req.user ? req.user.displayName : ''
});

});



  // ADD SURVEY
  router.get('/add', requireAuth, (req, res, next) => {
    console.log("survey details page");

    res.render('surveys/add', {
      title: 'Create Survey',
      surveys: '',
      displayName: req.user ? req.user.displayName : ''
    });
});


  router.post('/add', requireAuth, (req, res, next) => {
    console.log(req.body);//author, title, question, row

    let id = req.params.id;    
    survey.findOne({ _id: id }, function (err, survey) {
        if (err) {
            return console.error(err);
        }
        
        console.log('success body');

        let newSurvey = surveys({
          "Author": req.body.author,
          "Title": req.body.title,
           "MCQuestions": req.body.questionMC,
           "TFQuestions": req.body.questionTF,
           //"Created": today,
           "Active": req.body.active         
         });

         surveys.create(newSurvey, (err, surveys)=>{
          if(err){
              console.log(err);
              res.end(err);

          } 
          else{
              //refresh the survey index page
              res.redirect('/surveys');
            }
        });
    });
  });



// GET for Answer Survey
router.get('/answer/:id', (req, res, next) => {
  let surveyId = req.params.id;
  
  survey.default.findOne({ _id: surveyId }, function (err, survey) {
      if (err) {
          return console.error(err);
      }
     
      console.log(surveys)
      res.render('surveys/answerSurvey', {
        title: 'surveys',
        surveys: surveys,
        displayName: req.user ? req.user.displayName : ''  
      });
  });

});  


// Post for Answer Survey
router.post('/answer/:id', (req, res, next) => {
  let surveyId = req.params.id;
  let answers = [];
  let qCount = 0;
  while (true) {
      let qVal = req.body["question" + qCount];
      if (qVal == undefined)
          break;
      console.log(`Questions ${qCount}`, qVal);
      answers.push(qVal);
      qCount++;
  }
  let newAns = new answers.default({
      surveyId: surveyId,
      surveyOwner: "User",
      answers: answers,
      created: new Date(),
  });
  answers.default.create(newAns, (err, answer) => {
      if (err) {
          console.error(err);
          res.end(err);
      }
  });
  res.redirect("/surveys/answerSurvey");
});  
    


router.get('/edit/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;
  survey.findById(id, (err, surveyToEdit) =>{
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      res.render('surveys/edit', {title: 'Edit Survey', surveys: surveyToEdit,
      displayName: req.user ? req.user.displayName : ''})
    }
  });
});

router.post('/edit/:id', requireAuth, (req, res, next) => {
   let id = req.params.id;
   let editedSurvey = survey({
     "_id": id,
     "Title": req.body.title,
     "Author": req.body.author,
     "MCQuestions": req.body.questionMC,
     "TFQuestions": req.body.questionTF,
   });
   survey.updateOne({_id: id}, editedSurvey, (err)=>{
     if(err){
       console.log(err);
       res.end(err);
     }
     else
     {
       res.redirect('/surveys');
     }
   });


});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;
  survey.remove({_id:id}, (err)=>{
    if(err){
      console.log(err);
      res.end(err);
    }
    else
    {
      res.redirect('/surveys');
    }
  });
});

});



module.exports = router;