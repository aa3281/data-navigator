import { BlobServiceClient } from '@azure/storage-blob';

// Replace with your storage account details and SAS token
const accountName = '';
const sasToken = ''; // Replace with your SAS token
const containerName = ''; // Replace with your container name

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net?${sasToken}`
);

const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadFileToBlob = async (file) => {
    if (!file) return null;

    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadBrowserData(file);

        // Construct the URL to the uploaded file
        const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;

        // Return an object with the document name, link, and custom text
        return {
            name: blobName,
            url: blobUrl,
            text: 'File uploaded successfully.', // Customize this text as needed
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
