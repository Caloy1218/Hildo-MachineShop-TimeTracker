import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ memberId }) => {
  const [qrValue, setQrValue] = useState(memberId);

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-gen');
    canvas.toBlob((blob) => {
      saveAs(blob, `${qrValue}.png`);
    });
  };

  return (
    <div className="qr-code-container">
      <QRCode id="qr-gen" value={qrValue} />
      <Button onClick={downloadQRCode} variant="contained" color="primary">
        Download QR Code
      </Button>
    </div>
  );
};

export default QRCodeGenerator;
