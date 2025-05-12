const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the sample image if it exists
let base64Image;
try {
  const imagePath = path.join(__dirname, 'temp-face.jpg');
  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  } else {
    // Use a small test image if the file doesn't exist
    base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAADAAMDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AfwD/2Q==';
  }
} catch (error) {
  console.error('Error reading image file:', error);
  // Use a small test image if there's an error
  base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAADAAMDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AfwD/2Q==';
}

// Test the base64 endpoint
async function testBase64Endpoint() {
  try {
    console.log('Testing /api/emotion/analyze-base64 endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/emotion/analyze-base64', {
      base64Image: base64Image
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing endpoint:', error.response?.data || error.message);
  }
}

// Run the test
testBase64Endpoint(); 