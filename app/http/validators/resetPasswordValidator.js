const {check}=require('express-validator');
const validator=require("./validator");

class resetPasswordValidator extends validator{
    handle(){
        return[
            check('email')
            .isEmail()
            .withMessage("invalid Email"),
            check('password')
            .isLength({min:8})
            .withMessage("password can't be less 8 caracters")
        ]
    }
}

module.exports=new resetPasswordValidator();