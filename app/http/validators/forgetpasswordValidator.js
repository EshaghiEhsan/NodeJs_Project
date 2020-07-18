const {check}=require('express-validator');
const validator=require("./validator");

class forgetpasswordValidator extends validator{
    handle(){
        return[
            check('email')
            .isEmail()
            .withMessage("invalid Email")
        ]
    }
}

module.exports=new forgetpasswordValidator();