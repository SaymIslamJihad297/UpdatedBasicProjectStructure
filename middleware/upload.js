const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads');
    },
    filename: (req, file, cb)=>{
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}${ext}`);
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = upload;