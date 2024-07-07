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
import './Logs.css';

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

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'logs', editingLog.id), { fullName });
      fetchLogs();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const filterLogsByDate = (date) => {
    const filtered = logs.filter(log => {
      const logDate = dayjs(log.timeIn).format('YYYY-MM-DD');
      return logDate === dayjs(date).format('YYYY-MM-DD');
    });
    setFilteredLogs(filtered);
  };

  const handleExport = () => {
    // Get current month and year for filename
    const currentMonth = dayjs().format('YYYY-MM');
    const filename = `logs_${currentMonth}.csv`;
  
    // Prepare column headers
    const headers = ['Full Name', 'Time In', 'Time Out'];
    
    // Prepare rows data
    const rows = filteredLogs.map(log => [
      log.fullName,
      log.timeIn,
      log.timeOut,
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create Blob and save as CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };
  
  const columns = [
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'timeIn', headerName: 'Time In', width: 200 },
    { field: 'timeOut', headerName: 'Time Out', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box className="logs-container">
      <Typography variant="h4" gutterBottom align="center">Logs</Typography>
      <Box className="logs-export-button">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          className="exportButton"
          startIcon={<GetAppIcon />}
          onClick={handleExport}
          disabled={filteredLogs.length === 0}
        >
          Export Logs
        </Button>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredLogs} columns={columns} pageSize={5} />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Log</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the full name for this log entry.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Logs;
