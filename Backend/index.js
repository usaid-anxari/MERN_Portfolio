import app from './src/app.js';
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`);
})