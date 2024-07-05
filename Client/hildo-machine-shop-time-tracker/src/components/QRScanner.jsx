import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import './QRScanner.css';

const QrScannerComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [result, setResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [borderColor, setBorderColor] = useState('red');

  const processScan = async (data) => {
    if (data && data !== lastScanned && !isProcessingScan) {
      setIsProcessingScan(true);
      setLastScanned(data);
      setResult(data);
      setIsCameraActive(false);
      setBorderColor('green'); // Change border color to green when QR is read

      try {
        const fullName = data; // Assuming data directly provides the fullName

        const q = query(collection(db, 'logs'), where('fullName', '==', fullName), where('timeOut', '==', null));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const logDoc = querySnapshot.docs[0];
          await updateDoc(logDoc.ref, {
            timeOut: Timestamp.now(),
          });
          setDialogMessage(`${fullName} timed out successfully!`);
        } else {
          await addDoc(collection(db, 'logs'), {
            fullName,
            timeIn: Timestamp.now(),
            timeOut: null,
          });
          setDialogMessage(`${fullName} timed in successfully!`);
        }

        setDialogOpen(true);
      } catch (error) {
        console.error("Error processing QR code.", error);
        alert('Error processing QR code.');
      }

      setTimeout(() => {
        setIsProcessingScan(false);
        setLastScanned('');
        setBorderColor('red'); // Reset border color to red after processing
      }, 500);
    }
  };

  const debouncedProcessScan = debounce(processScan, 500);

  const handleResult = (result) => {
    if (result) {
      debouncedProcessScan(result.text);
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner Error:", error);
    alert("An error occurred while scanning. Please try again.");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const startScanner = () => {
    setResult('');
    setIsCameraActive(true);
  };

  const previewStyle = {
    height: 240,
    width: isMobile ? '100%' : 320,
    border: `4px solid ${borderColor}`, // Use dynamic border color
    borderRadius: 8,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  return (
    <div className="qr-scanner-container">
      <Typography variant="h4" gutterBottom align="center">QR Code Scanner</Typography>
      <Button variant="contained" color="primary" onClick={startScanner} disabled={isCameraActive}>
        Start Scanning
      </Button>
      {isCameraActive && (
        <Box className="qr-reader-wrapper">
          <QrScanner
            key={isMobile ? 'environment' : 'user'}
            delay={100}
            onScan={handleResult}
            onError={handleError}
            style={previewStyle}
            facingMode={isMobile ? 'environment' : 'user'}
          />
        </Box>
      )}
      {result && (
        <Typography variant="body1" align="center" className="scanned-result">
          Scanned: {result}
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Scan Result</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QrScannerComponent;
