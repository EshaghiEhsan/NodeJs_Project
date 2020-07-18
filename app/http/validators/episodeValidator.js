const validator = require('./validator');
const { check } = require('express-validator');

class episodeValidator extends validator{
    handle() {
        return [
            check('number')
                .not().isEmpty()
                .withMessage('شماره درس را وارد کنید'),
            check('title')
                .isLength({ min: 5 })
                .withMessage('عنوان ویدیو نباید کمتر از 5 کارکتر باشد'),
            check('course')
                .not().isEmpty()
                .withMessage('عنوان دوره را وارد کنید'),
            check('body')
                .not().isEmpty()
                .withMessage('متن دوره نمی تواند خالی باشد'),
            check('type')
                .not().isEmpty()
                .withMessage('نوع دوره را وارد کنید'),
            check('time')
                .not().isEmpty()
                .withMessage('زمان ویدیو را وارد کنید'),
            check('videoUrl')
                .not().isEmpty()
                .withMessage('لینک ویدیو را وارد کنید')
        ]
    }
}

module.exports = new episodeValidator();