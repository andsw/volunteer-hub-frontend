import React, { useState } from 'react';
import { Box, Button, Typography, Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const LogoUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  return (
    <Box sx={{ gridColumn: "span 4", mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Upload Organization Logo
      </Typography>
      <Box display="flex" alignItems="center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="logo-upload"
        />
        <label htmlFor="logo-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mr: 2 }}
          >
            Choose File
          </Button>
        </label>
        <Typography variant="body2">
          {selectedFile ? selectedFile.name : 'No file chosen'}
        </Typography>
      </Box>
      {previewUrl && (
        <Box mt={2}>
          <img 
            src={previewUrl} 
            alt="Logo Preview" 
            style={{ maxWidth: '100%', maxHeight: '100px', objectFit: 'contain' }} 
          />
        </Box>
      )}
    </Box>
  );
};

export default LogoUploader;