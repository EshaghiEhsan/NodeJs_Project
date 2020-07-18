const validator = require('./validator');
const { check } = require('express-validator');
const Permission = require('app/models/permission');

class permissionValidator extends validator {
    handle() {
        return [
            check('name')
                .isLength({ min: 3 })
                .withMessage('عنوان دسته نباید کمتر از 3 کارکتر باشد')
                .custom(async (value, { req }) => {
                    if(req.query._mehtod == 'PUT'){
                        let permission = await Permission.findById(req.parems.id);
                        if(permission.name == value) return;
                    }

                    let permission = await Permission.find({ name : value});
                    if(permission){
                        return req.flash('errors' , 'این دسته بندی قبلا ایجاد شده است')
                    }
                }),
            check('label')
                .not().isEmpty()
                .withMessage(' توضیحات دسترسی نمی تواند خالی باشد'),
        ]
    }
}

module.exports = new permissionValidator();