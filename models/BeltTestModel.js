var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var skillLength = function (skill) {
    return !(skill.length === 0 || skill.length > 2);
};


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



var skillSchema = new mongoose.Schema({ skill: 'string' });
skillSchema.pre('save', function (next) {
    if (this.skill.length > 0 && this.skill.length < 3) {
        return next(new Error('#sadpanda, your skills must be at least 3 characters long!'));
    }
    next();
});


//Instruction says use only ONE schema
var PetSchema = new mongoose.Schema({
    belt_test_model_name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    type: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        minlength: 3
    },
    skills: [skillSchema],
    likes: {
        type: Number,
        default: 0
    }
},{timestamps: true});
PetSchema.plugin(uniqueValidator);
PetSchema.pre('save', function (next) {
    if (this.skills.length > 3){
        return next(new Error('you can only have 3 belt_test_model skills'));
    }
    next();
});



// PetSchema.path('skills').validate(function(skills){
//     if(!skills){return false}
//     else if(skills.length === 0){return false}
//     return true;
// }, 'BeltTestModel needs to have at least one skill');


mongoose.model('BeltTestModel', PetSchema);
var BeltTestModel = mongoose.model('BeltTestModel');
