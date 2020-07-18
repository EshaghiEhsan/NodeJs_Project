const multer = require('multer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDir = ()=> {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();

    return `./public/uploads/images/${year}/${month}/${day}`;
}

const storageImage = multer.diskStorage({
    destination : (req , file , cb) => {
        let dir = getDir();
        mkdirp(dir).then((data , err)=>{
            if (err) console.log(err);
            cb(null , dir);
        })
    },

    filename : (req , file , cb) => {
        let filePath = getDir() + '/' + file.originalname;
        if (! fs.existsSync(filePath)){
            cb(null , file.originalname);
        }else {
            cb(null , Date.now() + '-' + file.originalname);
        }
    }
})

const uploadImage = multer ({
    storage : storageImage,
    limits : {
        fileSize : 1024 * 1024 * 5
    },
})

module.exports =  uploadImage;