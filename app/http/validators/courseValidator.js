const validator = require('./validator');
const { check } = require('express-validator');
const path = require('path');

class courseValidator extends validator{
    handle(){
        return[
            check('title')
                .isLength({min:15})
                .withMessage('××× عنوان دوره نباید کمتر از 15 کارکتر باشد ×××'),
            check('body')
                .not()
                .isEmpty()
                .withMessage('××× متن دوره نمیتواند خالی باشد ×××'),
            check('type')
                .not()
                .isEmpty()
                .withMessage('××× نوع دوره را وارد کنید ×××'),
            check('images')
                .custom(async (value , { req }) => {

                    if(req.query._method === 'PUT' && value === undefined) return;
                    if(! value){

                        throw new Error('تصویر دوره را وارد کنید')
                    }else {
                        const fileExe = ['.png', '.jpg', '.jepg' ,'.svg']
                        if( !fileExe.includes(path.extname(value))){
                            throw new Error('فایل انتخابی تصویر نمی باشد')
                        }
                    }
                }),
            check('price')
                .not()
                .isEmpty()
                .withMessage('××× هزینه دوره را وارد کنید ×××'),
            check('tags')
                .not()
                .isEmpty()
                .withMessage('××× تگ های دوره را وارد کنید ×××')

        ]
    }
}

module.exports = new courseValidator();