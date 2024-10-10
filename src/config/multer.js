const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   
    destination:(req, file, cb)=>{
        cb(null,'uploads/');
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extname){
        return cb(null, true);
    } else {
        cb('Error: Images and PDFs Only!');
    }
};



const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

module.exports = upload;
