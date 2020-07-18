const validator = require('./validator');
const { check } = require('express-validator');
const Category = require('app/models/category');

class categoryValidator extends validator {
    handle() {
        return [
            check('name')
                .isLength({ min: 3 })
                .withMessage('عنوان نباید کمتر از 3 کارکتر باشد')
                .custom(async (value, { req }) => {
                    if(req.query._mehtod == 'PUT'){
                        let category = await Category.findById(req.parems.id);
                        if(category.name == value) return;
                    }

                    let category = await Category.find({ name : value});
                    if(category){
                        return req.flash('errors' , 'این دسته بندی قبلا ایجاد شده است')
                    }
                }),
            check('parent')
                .not().isEmpty()
                .withMessage('جایگاه دسته نمی تواند خالی باشد'),
        ]
    }
}

module.exports = new categoryValidator();