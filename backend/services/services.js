// services/ipfsService.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const JWT =
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYTc3YjI3ZS02OGUxLTQxYzAtODdkMy0yNzEzMjZkNzdmM2YiLCJlbWFpbCI6Im1laG1vb2RuYWRlZW1raGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlZTg5ODJhYjBkYTYyYjMzNDVhNiIsInNjb3BlZEtleVNlY3JldCI6ImJkNTQ5Y2NlZWFiODk0NTg5MWIxNTg4NTIwOTIyYzcyNDc4ZGM1ZGM2YzY2ZjdkNjhlYzFkM2JjOWRlMDhlMzMiLCJleHAiOjE3NzQwMjQ1OTF9.TJ6mV0uUuPuBFaOU8djTVCm36sd13Q18_vuYZxCk5HU';

class IpfsService {
    static async uploadFileToIpfs(filePath, originalName) {
        const formData = new FormData();
        const file = fs.createReadStream(filePath);
        formData.append('file', file);

        const pinataMetadata = JSON.stringify({
            name: originalName,
        });
        formData.append('pinataMetadata', pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 0,
        });
        formData.append('pinataOptions', pinataOptions);

        try {
            const pinataResponse = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        Authorization: `Bearer ${JWT}`,
                    },
                }
            );

            if (!pinataResponse.data || !pinataResponse.data.IpfsHash) {
                throw new Error('Failed to upload file to IPFS');
            }

            return pinataResponse.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw error;
        }
    }
}

module.exports = IpfsService;