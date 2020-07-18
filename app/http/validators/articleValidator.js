const validator = require('./validator');
const { check } = require('express-validator');
const path = require('path');

class articleValidator extends validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 10 })
                .withMessage('عنوان مقاله نباید کمتر از 10 کارکتر باشد'),
            check('body')
                .not().isEmpty()
                .withMessage('متن مقاله نمی تواند خالی باشد'),
            check('images')
                .custom(async (value , { req }) => {
                    if(req.query._method === 'PUT' && value === undefined) return;
                    if(! value){
                        throw new Error('تصویر مقاله را وارد کنید')
                    }else {
                        const fileExe = ['.png', '.jpg', '.jepg' ,'.svg']
                        if( !fileExe.includes(path.extname(value))){
                            throw new Error('فایل انتخابی تصویر نمی باشد')
                        }
                    }
                }),
            check('tags')
                .not().isEmpty()
                .withMessage('تگ های مقاله را وارد کنید')
        ]
    }
}

module.exports = new articleValidator();