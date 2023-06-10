const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({ 
  cloud_name: 'dutkxnher', 
  api_key: '865557748222771', 
  api_secret: 'R3y4Bvpl1ONkUt7e_e0tZCQjeWU' 
});


module.exports = cloudinary;