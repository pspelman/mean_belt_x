var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var BeltTestModel = mongoose.model('BeltTestModel');
var BeltTestModels = mongoose.model('BeltTestModel');

mongoose.Promise = global.Promise;

class errorObject {
    constructor(){
        this.has_errors = false;
        this.err_list = [];
    }
}

router.get('/', function (req, res) {
    console.log(`reached the router`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//DONE: router.get('/', function(req, res){}
//get all belt_test_models
router.get('/belt_test_models', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`arrived at GET belt_test_models...getting all belt_test_models`,);
    BeltTestModels.find({}, function (err, belt_test_models) {
        if(err){
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.err_list.push(err.message);
            console.log(`there was an error looking up belt_test_models`, err);
            res.json({'message':'there was an error', 'errors': err.message, 'err_holder':err_holder, 'errs':errs})
        } else {
            res.json({'message': 'successfully retrieved belt_test_models', 'belt_test_models': belt_test_models, 'errs':errs});
        }
    });
});


//DONE: router.get('/belt_test_models/:id', function(req, res){}
//get a SINGLE author by ID
router.get('/belt_test_models/:id', function (req, res) {
    let errs = new errorObject();
    console.log(`req.body: `,req.body);
    let belt_test_model_id = req.params.id;
    console.log(`reached individual belt_test_model lookup`,);
    // res.json({'message':'working on it!'});
    //get the belt_test_model
    var beltPromise = new Promise(function (resolve, reject) {
        resolve(BeltTestModels.find({_id: req.params.id}));
    })
        .then(function (belt_test_model) {
            res.json({'message': 'successfully retrieved the belt_test_model', 'belt_test_model': belt_test_model});
        })
        .catch(function (err) {
            console.log(`caught err`, err);
            errs.has_errors = true;
            errs.err_list.push(err.message);
            res.json({'message':'There was a problem with the request', 'err':err.message, 'errs':errs})
        });

});






//DONE: router.post('/belt_test_models', function(req, res){}
//FIXME: backside validation errors - standardize the way they are sent back to the front
//create a belt_test_model
router.post('/belt_test_models', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    //new data recieved
    console.log(`request.body: `,req.body);

    console.log(`   recieved request to make new belt_test_model`,);
    let belt_test_model = new BeltTestModel();

    if (req.body.belt_test_model_name.length < 3) {
        errs.has_errors = true;
        errs.err_list.push("name must be at least 3 characters");
    }
    if (req.body.type.length < 3){
        errs.has_errors = true;
        errs.err_list.push("type must be at least 3 characters");
    }
    if (req.body.description.length < 3){
        errs.has_errors = true;
        errs.err_list.push("description must be at least 3 characters");
    }

    belt_test_model.belt_test_model_name = req.body.belt_test_model_name;;
    belt_test_model.type = req.body.type;
    belt_test_model.description = req.body.description;

    let new_skills = req.body.skills;
    console.log(`New skills`,new_skills);
    console.log(`New skills length: `,new_skills.length);
    // res.json({'message': 'Working on it'})

    console.log(`BeltTestModel new_skills recieved:`,new_skills);
    for(let i = 0; i < new_skills.length; i++){
        if(new_skills[i] === null){
            continue;
        }
        if (new_skills[i] && new_skills[i].length < 3) {
            errs.has_errors = true;
            errs.err_list.push('new_skills must be at least 3 characters');
            break;
        }
        belt_test_model.skills.push({skill: new_skills[i]});
        var subdoc = belt_test_model.skills[i];
        console.log(`SKILL SUBDOC: `,subdoc);

    }

    belt_test_model.save(function (err) {
        if (err) {
            // console.log(`there was an error saving to db`, err);
            errs.has_errors = true;
            errs.err_list.push(err.message);
            console.log(`there were errors saving to db`, err.message );
            res.json({'message': 'unable to save new belt_test_model', 'errs': errs})

        } else {
            console.log(`successfully saved!`);
            res.json({'message': 'Saved new belt_test_model!', 'errs': errs})
        }
    });

});


//TODO : function for liking belt_test_model

router.put('/belt_test_models/like/:id', function (req, res) {
    console.log(`like request: `, req.params._id);


    BeltTestModels.findOneAndUpdate(
        { _id: req.params.id },
        {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
        if (err) {
            throw err;
        }
        else {
            console.log(belt_test_model_data);
            res.json({'message': 'did the likes', 'belt_test_model':belt_test_model_data})
        }
    })
});



//FIXME: standardize sending back errors
//update an author's name
router.put('/belt_test_models/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`ID: `,req.params.id);
    console.log(`reached belt_test_model updater. Body: `, req.body);


    var opts = {runValidators: true , context: 'query'};
    BeltTestModels.findOneAndUpdate({_id: req.params.id}, {
        belt_test_model_name: req.body.belt_test_model_name,
        type: req.body.type,
        description: req.body.description,
        // "$set": {
        //     "skills.0": req.body.skills[0],
        // }
        // skills: [req.body.skills[0], req.body.skills[1], req.body.skills[2]],
    }, opts, function (err) {
        if (err) {
            console.log(`there was an error updating`, err.message);
            errs.has_errors = true;
            errs.err_list.push(err.message);
            res.json({'message': 'problem updating belt_test_model', 'errs': errs});

        } else {
            res.json({'message': 'successfully updated belt_test_model', 'errs': errs});

        }
    });

});



//FIXME: ADD quote to selected author
router.put('/add_belt_test_model/:belt_test_model_id', function (req, res) {
    console.log(`got request to update author's quotes auth: `,req.params.belt_test_model_id);
    let errors = [];
    let belt_test_model_id = req.params.belt_test_model_id;
    let text_to_add_as_quote = req.body.quote_text;

    //validate quote length
    if(text_to_add_as_quote.length < 3){
        console.log(`you done messed up`,);
        let err = new Error("quote is not long enough");
        errors.push(err.message);
        res.json({'message':'done with the thing', 'author':belt_test_model_id, 'errors': errors});

    } else {
        BeltTestModels.find({_id: belt_test_model_id}, function (err, author) {
            if (err) {
                errors.push(err.message);
                res.json({"message":"error adding quote", "errors":errors})
            } else {
                let author_to_update = author[0];
                console.log(`got the author, continue to ADD a quote:`,author);
                author[0].quotes.push({ quote_text: text_to_add_as_quote });
                author[0].save();
                res.json({'message':'Successfully saved', 'author':belt_test_model_id});
            }
        });
    }
});

//TODO: router.delete('/', function(req, res){}
router.delete('/belt_test_models/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];

    console.log(`trying to delete...or adopt...the belt_test_model`,);
    let belt_test_model_id = req.params.id;

    console.log(`belt_test_model: ${belt_test_model_id}`);
    BeltTestModels.remove({_id: req.params.id}, function (err) {
        if (err) {
            errs.has_errors = true;
            errs.err_list.push(err);
            res.json({'message': 'Error when deleting belt_test_model', 'errs': errs});

        } else {
            res.json({'message': 'successfully deleted belt_test_model', 'errs': errs});

        }

    });

    // res.json({'message': 'trying to remove belt_test_model', 'belt_test_model_id': belt_test_model_id});


});

router.all("/*", (req,res,next) => {
    console.log(`reached wildcard route...need to redirect to Angular templates`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});



function update_by_quote_sub_id(){
    BeltTestModels.findOne({'quote._id': quoteId}).then(author => {
        let quote = author.quote.id(quoteId);
        quote.votes = 'something';
        return author.save();
    });
}

// Note that sub document array return from mongoose are mongoose
// array instead of the native array data type. So you can manipulate them using .id .push .pop .remove method
// http://mongoosejs.com/docs/subdocs.html



//create one sample thing on load
var createSampleBeltTestModel = function () {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`trying to make a sample BeltTestModel`,);
    var BeltTestModelInstance = new BeltTestModel();
    // BeltTestModelInstance.belt_test_model_name = 'Barney';
    // BeltTestModelInstance.type = 'cat';
    // BeltTestModelInstance.description = 'fat cat in Washington';
    // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
    BeltTestModelInstance.belt_test_model_name = 'Blake';
    BeltTestModelInstance.type = 'Dog';
    BeltTestModelInstance.description = 'Likes lasagna';
    BeltTestModelInstance.skills.push({skill: 'pooping'});
    var subdoc = BeltTestModelInstance.skills[0];
    console.log(`SKILL SUBDOC: `,subdoc);

    BeltTestModelInstance.save(function (err) {
        if (err) {
            // console.log(`there was an error saving to db`, err);
            errs.has_errors = true;
            errs.err_list.push(err.message);
            console.log(`there were errors saving to db`, err.message );
        } else {
            console.log(`successfully saved!`);
        }
    });
};
// createSampleBeltTestModel();


module.exports = router;
