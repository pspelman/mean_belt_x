var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var SkillSchema = new mongoose.Schema({
    skill: {
        type: String,
        minlength: 3
    }
});

//VALIDATION
SkillSchema.pre('save', function (next) {
    if ('invalid' === this.skill) {
        return next(new Error('#sadpanda'));
    }
    next();
});



var reviewSchema = new mongoose.Schema({
    user_name: 'string',
    review_text: 'string',
    stars: 'number',
}, {timestamps: true});

reviewSchema.pre('save', function (next) {
    // if (this.skill.length > 0 && this.skill.length < 3) {
    //     return next(new Error('#sadpanda, your reviews must be at least 3 characters long!'));
    // }
    if (this.user_name.length < 3) {
        return next(new Error('name must be more than 3 characters to leave a review'));
    }
    if (this.review_text.lengh < 3) {
        return next(new Error('review must be more than 3 characters to leave a review'));
    }
    next();
});


//Instruction says use only ONE schema
var RestaurantSchema = new mongoose.Schema({
    restaurant_name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    cuisine_type: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    reviews: [reviewSchema],
    likes: {
        type: Number,
        default: 0
    }
},{timestamps: true});
RestaurantSchema.plugin(uniqueValidator);

//FIXME: can take this out because they can have more than 3 reviews
// RestaurantSchema.pre('save', function (next) {
//     if (this.reviews.length > 3){
//         return next(new Error('you can only have 3 restaurant reviews'));
//     }
//     next();
// });

mongoose.model('RestaurantModel', RestaurantSchema);
var RestaurantModel = mongoose.model('RestaurantModel');
