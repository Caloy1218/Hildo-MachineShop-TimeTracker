import React, { useState, useEffect, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';
import { collection, addDoc, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import './QRScanner.css'; // Import CSS file
import { db } from '../firebaseConfig';

const QRScanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [result, setResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [borderColor, setBorderColor] = useState('red');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const processScan = async (data) => {
    if (data && data !== lastScanned && !isProcessingScan) {
      setIsProcessingScan(true);
      setLastScanned(data);
      setResult(data);
      setIsCameraActive(false);
      setBorderColor('green'); // Change border color to green when QR is read

      try {
        const foundMember = members.find((member) => member.id === data);

        if (foundMember) {
          const logRef = collection(db, 'logs');
          const logQuery = query(logRef, where('memberId', '==', foundMember.id), where('timeOut', '==', null));
          const logSnapshot = await getDocs(logQuery);

          if (!logSnapshot.empty) {
            const logDoc = logSnapshot.docs[0];
            await updateDoc(logDoc.ref, {
              timeOut: Timestamp.now(),
            });
            setDialogMessage(`${foundMember.name} checked out successfully!`);
          } else {
            await addDoc(logRef, {
              memberId: foundMember.id,
              fullName: foundMember.name,
              timeIn: Timestamp.now(),
              timeOut: null,
            });
            setDialogMessage(`${foundMember.name} checked in successfully!`);
          }

          setDialogOpen(true);
        } else {
          setDialogMessage("Member not found.");
          setDialogOpen(true);
        }
      } catch (error) {
        console.error('Error processing QR code:', error);
        alert('Error processing QR code. Please try again.');
      }

      setTimeout(() => {
        setIsProcessingScan(false);
        setLastScanned('');
        setBorderColor('red'); // Reset border color to red after processing
      }, 500);
    }
  };

  const debouncedProcessScan = useCallback(debounce(processScan, 500), [lastScanned, isProcessingScan, members]);

  const handleResult = (result) => {
    if (result) {
      debouncedProcessScan(result.text);
    }
  };

  const handleError = (error) => {
    console.error('QR Scanner Error:', error);
    alert('An error occurred while scanning. Please try again.');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const startScanner = () => {
    setResult('');
    setIsCameraActive(true);
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  const previewStyle = {
    height: 240,
    width: isMobile ? '100%' : 320,
    border: `5px solid ${borderColor}`, // Corrected border style here
  };

  return (
    <div className="qr-scanner-container">
      <Typography variant="h4" gutterBottom align="center">
        QR Code Scanner
      </Typography>
      <Button variant="contained" color="primary" onClick={startScanner} disabled={isCameraActive}>
        Start Scanning
      </Button>
      {isCameraActive && (
        <Box className="qr-reader-wrapper">
          <QrScanner
            delay={100}
            onError={handleError}
            onScan={handleResult}
            style={previewStyle}
            facingMode={facingMode}
          />
          {isMobile && (
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleCamera}
              startIcon={<FlipCameraIosIcon />}
              className="flip-camera-button"
            >
              Flip Camera
            </Button>
          )}
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
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QRScanner;