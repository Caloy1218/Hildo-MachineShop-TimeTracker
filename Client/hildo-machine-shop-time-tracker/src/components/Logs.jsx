import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

const Logs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [fullName, setFullName] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogsByDate(selectedDate);
  }, [logs, selectedDate]);

  const fetchLogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'logs'));
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timeIn: doc.data().timeIn?.toDate().toLocaleString(),
        timeOut: doc.data().timeOut ? doc.data().timeOut.toDate().toLocaleString() : '',
      }));
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'logs', id));
      fetchLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleEdit = async (log) => {
    setEditingLog(log);
    setFullName(log.fullName);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLog(null);
    setFullName('');
  };

  const handleSubmit = async () => {
    try {
      if (editingLog) {
        await updateDoc(doc(db, 'logs', editingLog.id), {
          fullName,
          timeOut: Timestamp.now(), // Update timeOut when saving edits
        });
        fetchLogs();
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  const filterLogsByDate = (date) => {
    const filtered = logs.filter(log => dayjs(log.timeIn).isSame(date, 'day'));
    setFilteredLogs(filtered);
  };

  const handleExportLogs = () => {
    // Prepare data for export (assuming CSV format)
    const csvData = [
      ['Name', 'Time In', 'Time Out'],
      ...filteredLogs.map(log => [
        log.fullName,
        `"${log.timeIn}"`, // Enclose timeIn in quotes to ensure date/time are together
        `"${log.timeOut}"` // Enclose timeOut in quotes to ensure date/time are together
      ])
    ];
  
    // Convert data to CSV format
    const csvContent = csvData.map(row => row.join(',')).join('\n');
  
    // Create Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
    // Trigger download using file-saver
    saveAs(blob, 'Time in and Time out.csv');
  };
  

  const columns = [
    { field: 'fullName', headerName: 'Name', flex: 1 },
    { field: 'timeIn', headerName: 'Time In', flex: 1 },
    { field: 'timeOut', headerName: 'Time Out', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row)} sx={{ color: '#28a745' }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} sx={{ color: '#dc3545' }} >
            <DeleteIcon />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2} className="logs-container">
        <Typography variant="h4" gutterBottom>Check-in/Check-out Logs</Typography>
          
          {/* Adjusted structure for Export Logs button */}
          <Box className="logs-export-button">
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button
            className='exportButton'
              variant="contained"
              color="primary"
              startIcon={<GetAppIcon />}
              onClick={handleExportLogs}
              style={{ marginLeft: isMobile ? 'auto' : '10px' }} // Adjust button alignment
            >
              Export Logs
            </Button>s
          </Box>

          <div style={{ height: isMobile ? 300 : 400, width: '100%', marginBottom: 20 }}>
            <DataGrid rows={filteredLogs} columns={columns} pageSize={5} />
          </div>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Log</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Edit the name for this log entry.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Full Name"
                type="text"
                fullWidth
                variant="standard"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
    </LocalizationProvider>
  );
};

export default Logs;
