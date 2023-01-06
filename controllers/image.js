const multer = require('multer');
const path = require('path');


class Image {
 constructor(type) {
  this.type = type;
 }


 destination() {
  let opts = ['product', 'company']
  // in opts ? true : null
  if (opts.includes(this.type) && typeof this.type === 'string') {
   return true;
  }
  else {
   return null
  }
 }


 checkExtension(image) {
  if (typeof image != 'string') {
   return new Error('TypeError');
  }

  if (image) {
   let validExtensions = ['png', 'jpg', 'jpeg']
   let extension = (image).split('.')[-1];
   const isvalid = validExtensions.includes(extension) ? true : false;
   return isvalid;
  }

 }

 createDir() {
  if (this.destination()) { return path.join("./public/", 'asserts', this.type) }
  else { return null };
 }

 multerOptDestination() {
  // return a multer object wth the destination
  if (!this.destination) {
   return new Error('destination not known');
  }
  if (this.destination) {
   let dir = this.createDir();
   return multer.diskStorage({
    destination: function (req, file, cb) {
     cb(null, dir)
    },
    filename: function (req, file, cb) {
     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
     cb(null, uniqueSuffix);
    }
   })
  }
 }

 upload() {
  return multer({ storage: this.multerOptDestination() })
 }

}



module.exports = Image;