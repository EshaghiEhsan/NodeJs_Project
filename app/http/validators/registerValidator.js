const {check}=require('express-validator');

class registerValidator{
    handle(){
        return[
            check('name')
            .isLength({min:6})
            .withMessage("name can't be less 6 caracter"),
            check('email')
            .isEmail()
            .withMessage("invalid Email"),
            check('password')
            .isLength({min:8})
            .withMessage("password can't be less 8 caracters")
        ]
    }
}

module.exports=new registerValidator();