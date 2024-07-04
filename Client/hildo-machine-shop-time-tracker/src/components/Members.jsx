import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, IconButton, Container, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, QrCode as QrCodeIcon } from '@mui/icons-material';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import QRCodeGenerator from './QRCodeGenerator';
import './Members.css';

const Members = ({ darkMode }) => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrText, setQrText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const membersCollectionRef = collection(db, 'members');

  useEffect(() => {
    const fetchMembers = async () => {
      const data = await getDocs(membersCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchMembers();
  }, []);

  const handleClickOpen = (row = null) => {
    setCurrentRow(row ? { ...row } : { name: '', age: '', department: '', qrPic: '' });
    setEditMode(!!row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRow(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        const memberDoc = doc(db, 'members', currentRow.id);
        await updateDoc(memberDoc, currentRow);
      } else {
        const newDocRef = await addDoc(membersCollectionRef, currentRow);
        setCurrentRow({ ...currentRow, id: newDocRef.id });
      }

      const data = await getDocs(membersCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      handleClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const memberDoc = doc(db, 'members', deleteTargetId);
      await deleteDoc(memberDoc);

      const data = await getDocs(membersCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRow({ ...currentRow, [name]: value });
  };

  const handleQrOpen = (row) => {
    setQrText(row.name); // Pass name instead of id
    setQrOpen(true);
  };

  const handleQrClose = () => {
    setQrOpen(false);
    setQrText('');
  };

  const getAvatarInitials = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map((part) => part.charAt(0)).join('');
    return initials.toUpperCase();
  };

  const columns = [
    {
      field: 'avatar',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Avatar sx={{fontSize:'10px',
          margin:'auto',
          marginTop:'5px'
        }}>{getAvatarInitials(params.row.name)}</Avatar>
      ),
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
    { field: 'department', headerName: 'Department', width: 150 },
    {
      field: 'qrPic',
      headerName: 'QR Pic',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleQrOpen(params.row)}>
          <QrCodeIcon />
        </IconButton>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <strong>
          <IconButton
            size="small"
            onClick={() => handleClickOpen(params.row)}
            sx={{ color: '#28a745' }} // Edit icon color
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{ color: '#dc3545' }} // Delete icon color
          >
            <DeleteIcon />
          </IconButton>
        </strong>
      ),
    },
  ];

  return (
    <Container className={`members-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Members</h1>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleClickOpen()}
        style={{ marginBottom: '20px' }}
      >
        Add Member
      </Button>
      <div style={{ height: 400, width: '100%', marginTop: 20 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={5} 
          autoHeight 
          disableSelectionOnClick // Disable checkbox selection
          sx={{
            backgroundColor: darkMode ? '#2e2e2e' : 'inherit',
            color: darkMode ? 'white' : 'inherit',
          }}
        />
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle>{editMode ? 'Edit Member' : 'Add Member'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editMode ? 'Edit the details of the member.' : 'Enter the details of the new member.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentRow?.name || ''}
            onChange={handleInputChange}
            sx={{
              '& .MuiInputBase-input': {
                color: darkMode ? '#3f3f3f' : 'inherit',
              },
            }}
          />
          <TextField
            margin="dense"
            name="age"
            label="Age"
            type="number"
            fullWidth
            variant="standard"
            value={currentRow?.age || ''}
            onChange={handleInputChange}
            sx={{
              '& .MuiInputBase-input': {
                color: darkMode ? '#3f3f3f' : 'inherit',
              },
            }}
          />
          <TextField
            margin="dense"
            name="department"
            label="Department"
            type="text"
            fullWidth
            variant="standard"
            value={currentRow?.department || ''}
            onChange={handleInputChange}
            sx={{
              '& .MuiInputBase-input': {
                color: darkMode ? '#3f3f3f' : 'inherit',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>{editMode ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={qrOpen} onClose={handleQrClose} maxWidth="xs">
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent>
          <QRCodeGenerator memberName={qrText} /> {/* Pass memberName instead of memberId */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQrClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Members;
