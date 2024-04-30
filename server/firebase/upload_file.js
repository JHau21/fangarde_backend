const admin = require('./index.js');
const bucket = admin.storage().bucket();

async function uploadImageToStorage(fileName, base64String){
    // Extract MIME type from base64 string
    const header = base64String.split(';base64,').shift();
    const contentType = header.split(':').pop();
    let buffer;
    let base64Data;
    if(contentType === "image/svg+xml"){
        // decode base64 to string for svg
        base64Data = Buffer.from(base64String.split(',').pop(), 'base64').toString('utf-8');
        buffer = Buffer.from(base64Data);
    }else{
        // handle other image formats
        base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        buffer = Buffer.from(base64Data, 'base64');
    }
    //Set suffix of filename to contentType
    fileName = `${fileName}.${contentType.split('/')[1]}`
    // Create a new blob in the bucket and upload the file data
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: contentType, // or whatever your image content type is
        },
    });

    blobStream.end(buffer);

    await new Promise((resolve, reject) =>
        blobStream.on('finish', resolve).on('error', reject)
    );

    // Get a signed URL for the uploaded file with a 10-year expiration time
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 10);

    const url = await blob.getSignedUrl({
        action: 'read',
        expires: expirationDate,
    });

    // Return the public URL of the uploaded file
    return url[0]
    // return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
};

module.exports = uploadImageToStorage
