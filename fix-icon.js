const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/f047e692-1709-44b8-a9c1-825eb902fc53/generated_images/square-restaurant-icon-logo-for-siri-ind-24be25f4-20251206094614.jpg';
const outputPath = path.join(__dirname, 'public', 'icon.png');

console.log('Downloading new icon...');

https.get(imageUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error('Failed to download image:', response.statusCode);
    process.exit(1);
  }

  const fileStream = fs.createWriteStream(outputPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('✅ New icon saved to public/icon.png');
    console.log('File size:', fs.statSync(outputPath).size, 'bytes');
  });
}).on('error', (err) => {
  console.error('Error downloading image:', err.message);
  process.exit(1);
});
