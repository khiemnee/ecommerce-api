import  cloudinary from 'cloudinary'
import { cloudApi, cloudApiSecret, cloudName } from '../secret';

cloudinary.v2.config({ 
  cloud_name: cloudName, 
  api_key: cloudApi, 
  api_secret: cloudApiSecret
});


export default cloudinary