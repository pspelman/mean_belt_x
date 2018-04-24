var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var RestaurantModel = mongoose.model('RestaurantModel');
var RestaurantModels = mongoose.model('RestaurantModel');

mongoose.Promise = global.Promise;

class errorObject {
    constructor(){
        this.has_errors = false;
        this.error_list = [];
    }
}

router.get('/', function (req, res) {
    console.log(`reached the router`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//get all restaurants
router.get('/restaurants', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`arrived at GET restaurants...getting all restaurants`,);
    RestaurantModels.find({}, function (err, restaurants) {
        if(err){
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there was an error looking up restaurants`, err);
            res.json({'message':'there was an error', 'errors': err.message, 'err_holder':err_holder, 'errs':errs})
        } else {
            res.json({'message': 'successfully retrieved restaurants', 'restaurants': restaurants, 'errs':errs});
        }
    });
});


//COMPLETE: REVIEW router.get('/restaurants/:id', function(req, res){}
//get a SINGLE author by ID
router.get('/restaurants/:id', function (req, res) {
    console.log(`reached individual restaurant lookup`,);
    let errs = new errorObject();
    console.log(`req.body: `,req.body);
    let restaurant_id = req.params.id;
    // res.json({'message':'working on it!'});
    //get the restaurant
    var beltPromise = new Promise(function (resolve, reject) {
        resolve(RestaurantModels.find({_id: req.params.id}));
    })
        .then(function (restaurant) {
            res.json({'message': 'successfully retrieved the restaurant', 'restaurant': restaurant});
        })
        .catch(function (err) {
            console.log(`caught err`, err);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            res.json({'message':'There was a problem with the request', 'errs':errs})
        });
});



//FIXME: backside validation errors - standardize the way they are sent back to the front
//create a restaurant
router.post('/restaurants', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    //new data recieved
    console.log(`request.body: `,req.body);

    console.log(`recieved request to make new restaurant`,);

    let restaurant = new RestaurantModel();
    console.log(`initiated model`,);

    if (req.body.restaurant_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("name must be at least 3 characters");
    }
    if (req.body.cuisine_type.length < 3){
        errs.has_errors = true;
        errs.error_list.push("type must be at least 3 characters");
    }
    if (req.body.description.length < 3){
        errs.has_errors = true;
        errs.error_list.push("description must be at least 3 characters");
    }

    if (errs.has_errors) {
        res.json({"message": "validation errors encountered when trying to save new restaurant", "errs": errs});
    } else {
        restaurant.restaurant_name = req.body.restaurant_name;
        restaurant.cuisine_type = req.body.cuisine_type;
        restaurant.description = req.body.description;

        restaurant.save(function (err) {
            if (err) {
                // console.log(`there was an error saving to db`, err);
                errs.has_errors = true;
                errs.error_list.push(err.message);
                console.log(`there were errors saving to db`, err.message );
                res.json({'message': 'unable to save new restaurant', 'errs': errs})

            } else {
                console.log(`successfully saved!`);
                res.json({'message': 'Saved new restaurant!', 'errs': errs})
            }
        });

    }

});



//TODO: function for adding a review on a restaurant
router.put('/reviews/:id', function (req, res) {
    console.log(`request to add new review to restaurant ${req.params.id }`,);
    console.log(`BODY: `,req.body);

    let errs = new errorObject();
    let err_holder = [];

    //VALIDATION FOR REVIEWS
    if (req.body.stars < 1 || req.body.stars > 5) {
        errs.has_errors = true;
        errs.error_list.push("Stars may only be between 1 and 5");
    }
    if (req.body.review_text.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("Reviews must be at least 3 characters long");
    }
    if (req.body.user_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("User name must be at least 3 characters long");
    }


    if (errs.has_errors) {
        res.json({"message":"there were errors adding the review", "errs": errs});

    }
    else {

        //TODO: Find restaurant
        let current_restaurant;
        RestaurantModel.find({_id: req.params.id}).exec(function (err, restaurant) {
            if (err) {
                console.log(`there was an error finding the restaurant`, err);
            } else {
                console.log(`found restaurant`, restaurant);
                current_restaurant = restaurant;

            }
            console.log(`CURRENT REST:`, current_restaurant);
        });

        var opts = {runValidators: true, context: 'query'};
        RestaurantModel.findOneAndUpdate({_id: req.params.id}, {
                $push: {
                    reviews: {
                        user_name: req.body.user_name,
                        review_text: req.body.review_text,
                        stars: req.body.stars
                    }
                }
            },
            opts,
            function (err, restaurant) {
                if (err) {
                    console.log(`errors trying to add review`, err);
                    errs.has_errors = true;
                    errs.error_list.push(err.message);
                    res.json({"message": "error while trying to add review", 'restaurant': restaurant, 'errs': errs});

                } else {
                    res.json({"message": "Successfully added review!", 'restaurant': restaurant, 'errs': errs});

                }
            });
    }

});




//FIXME: standardize sending back errors
//update an restaurant's name
router.put('/restaurants/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`ID: `,req.params.id);
    console.log(`reached restaurant updater. Body: `, req.body);


    var opts = {runValidators: true , context: 'query'};
    RestaurantModels.findOneAndUpdate({_id: req.params.id}, {
        restaurant_name: req.body.restaurant_name,
        cuisine_type: req.body.cuisine_type,
        description: req.body.description,
    }, opts, function (err) {
        if (err) {
            console.log(`there was an error updating`, err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            res.json({'message': 'problem updating restaurant', 'errs': errs});

        } else {
            res.json({'message': 'successfully updated restaurant', 'errs': errs});
        }
    });
});



//FIXME: ADD quote to selected author
router.put('/add_belt_test_model/:restaurant_id', function (req, res) {
    console.log(`got request to update author's quotes auth: `,req.params.restaurant_id);
    let errors = [];
    let restaurant_id = req.params.restaurant_id;
    let text_to_add_as_quote = req.body.quote_text;

    //validate quote length
    if(text_to_add_as_quote.length < 3){
        console.log(`you done messed up`,);
        let err = new Error("quote is not long enough");
        errors.push(err.message);
        res.json({'message':'done with the thing', 'author':restaurant_id, 'errors': errors});

    } else {
        RestaurantModels.find({_id: restaurant_id}, function (err, author) {
            if (err) {
                errors.push(err.message);
                res.json({"message":"error adding quote", "errors":errors})
            } else {
                let author_to_update = author[0];
                console.log(`got the author, continue to ADD a quote:`,author);
                author[0].quotes.push({ quote_text: text_to_add_as_quote });
                author[0].save();
                res.json({'message':'Successfully saved', 'author':restaurant_id});
            }
        });
    }
});



//TODO: router.delete('/', function(req, res){}
router.delete('/restaurants/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];

    console.log(`trying to delete the restaurant`,);
    let restaurant_id = req.params.id;

    console.log(`restaurant: ${restaurant_id}`);
    RestaurantModels.remove({_id: req.params.id}, function (err) {
        if (err) {
            errs.has_errors = true;
            errs.error_list.push(err);
            res.json({'message': 'Error when deleting restaurant', 'errs': errs});
        } else {
            res.json({'message': 'successfully deleted restaurant', 'errs': errs});
        }
    });
});

router.all("/*", (req,res,next) => {
    console.log(`reached wildcard route...need to redirect to Angular templates`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//TODO : function for liking restaurant
router.put('/restaurants/like/:id', function (req, res) {
    console.log(`like request: `, req.params.id);

    RestaurantModels.findOneAndUpdate(
        { _id: req.params.id },
        {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
        if (err) {
            throw err;
        }
        else {
            console.log(belt_test_model_data);
            res.json({'message': 'did the likes', 'restaurant':belt_test_model_data})
        }
    })
});






function update_by_quote_sub_id(){
    RestaurantModels.findOne({'quote._id': quoteId}).then(author => {
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
    console.log(`trying to make a sample RestaurantModel`,);
    var BeltTestModelInstance = new RestaurantModel();
    // BeltTestModelInstance.restaurant_name = 'Barney';
    // BeltTestModelInstance.type = 'cat';
    // BeltTestModelInstance.description = 'fat cat in Washington';
    // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
    BeltTestModelInstance.restaurant_name = 'Blake';
    BeltTestModelInstance.type = 'Dog';
    BeltTestModelInstance.description = 'Likes lasagna';
    BeltTestModelInstance.skills.push({skill: 'pooping'});
    var subdoc = BeltTestModelInstance.skills[0];
    console.log(`SKILL SUBDOC: `,subdoc);

    BeltTestModelInstance.save(function (err) {
        if (err) {
            // console.log(`there was an error saving to db`, err);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there were errors saving to db`, err.message );
        } else {
            console.log(`successfully saved!`);
        }
    });
};
// createSampleBeltTestModel();


module.exports = router;
