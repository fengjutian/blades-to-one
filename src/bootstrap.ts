// Bootstrap file to load environment variables before starting the application
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file with absolute path
const result = dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
} else {
  console.log('.env file loaded successfully');
}

// Now start the application
import './index';