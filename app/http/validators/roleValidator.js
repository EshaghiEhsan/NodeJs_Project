const validator = require('./validator');
const { check } = require('express-validator');
const Role = require('app/models/role');

class roleValidator extends validator {
    handle() {
        return [
            check('name')
                .isLength({ min: 3 })
                .withMessage('عنوان سطح دسترسی نباید کمتر از 3 کارکتر باشد')
                .custom(async (value, { req }) => {
                    if (req.query._mehtod == 'PUT') {
                        let role = await Role.findById(req.parems.id);
                        if (role.name == value) return;
                    }

                    let role = await Role.find({ name: value });
                    if (role) {
                        return req.flash('errors', 'این سطح دسترسی قبلا ایجاد شده است')
                    }
                }),
            check('label')
                .not().isEmpty()
                .withMessage(' توضیحات دسترسی نمی تواند خالی باشد'),
            check('permissions')
                .not().isEmpty()
                .withMessage(' دسترسی نمی تواند خالی باشد'),
        ]
    }
}

module.exports = new roleValidator();