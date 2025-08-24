const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

export const uploadNFTToPinata = async (imageFile, name, description) => {
  const jwt = import.meta.env.VITE_PINATA_JWT;
  
  if (!jwt) {
    throw new Error('Pinata JWT not configured. Please add VITE_PINATA_JWT to your .env file');
  }

  try {
    console.log('📤 Uploading image to IPFS...');
    
    // Upload image
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const imageResponse = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${jwt}` },
      body: formData
    });

    if (!imageResponse.ok) {
      throw new Error('Failed to upload image to Pinata');
    }

    const imageResult = await imageResponse.json();
    const imageUrl = `${PINATA_GATEWAY}/${imageResult.IpfsHash}`;
    
    console.log('📋 Creating metadata...');
    
    // Upload metadata
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
      attributes: [
        { trait_type: "Created By", value: "Peter's Portfolio" },
        { trait_type: "Upload Date", value: new Date().toLocaleDateString() },
        { trait_type: "File Type", value: imageFile.type }
      ]
    };
    
    const metadataResponse = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: { name: `${name} Metadata` }
      })
    });

    if (!metadataResponse.ok) {
      throw new Error('Failed to upload metadata to Pinata');
    }

    const metadataResult = await metadataResponse.json();
    const metadataUrl = `${PINATA_GATEWAY}/${metadataResult.IpfsHash}`;
    
    console.log('✅ Successfully uploaded to IPFS!');
    
    return { imageUrl, metadataUrl, metadata };
    
  } catch (error) {
    console.error('❌ IPFS upload failed:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload an image smaller than 10MB.');
  }
  
  return true;
};
