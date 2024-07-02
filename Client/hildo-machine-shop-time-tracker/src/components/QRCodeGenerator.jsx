import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ memberName }) => { // Change prop name to memberName
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-gen');
    canvas.toBlob((blob) => {
      saveAs(blob, `${memberName}.png`); // Use memberName instead of memberId
    });
  };

  return (
    <div className="qr-code-container">
      <QRCode id="qr-gen" value={memberName} /> {/* Use memberName instead of memberId */}
      <Button onClick={downloadQRCode} variant="contained" color="primary">
        Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeGenerator;
