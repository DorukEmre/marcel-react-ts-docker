const multer = require('multer')
const path = require('path')

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname)
    // console.log(ext)
    // console.log('multer file', file)
    if (
      // ext !== '.jpg' &&
      // ext !== '.jpeg' &&
      // ext !== '.png' &&
      // File processed as blob by image cropper
      !ext &&
      file.mimetype !== 'image/jpeg'
    ) {
      cb(new Error('File type is not supported'), false)
      return
    }
    cb(null, true)
  },
})
