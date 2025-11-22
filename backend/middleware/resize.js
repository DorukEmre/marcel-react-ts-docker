const cloudinary = require('../middleware/cloudinary')
const sharp = require('sharp')
let streamifier = require('streamifier')

const resizeAndCloudinary = async (req, dimension, folderName) => {
  // Sharp transforms to buffer
  const data = await sharp(req.file.path)
    .resize({ width: dimension })
    .toFormat('jpeg')
    .toBuffer()

  // Convert buffer to stream before upload to cloudinary with .pipe() method
  let uploadFromBuffer = (req) => {
    return new Promise((resolve, reject) => {
      let cld_upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(error)
          }
        },
      )
      streamifier.createReadStream(data).pipe(cld_upload_stream)
    })
  }
  return uploadFromBuffer(req)
}

module.exports = resizeAndCloudinary
