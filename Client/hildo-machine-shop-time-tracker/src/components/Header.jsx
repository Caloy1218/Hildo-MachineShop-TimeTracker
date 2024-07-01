import React from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hildo Machine Shop
        </Typography>
        <Button color="inherit" onClick={handleClick}>Menu</Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose} component={Link} to="/">Home</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/members">Members</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/logs">Logs</MenuItem>
          <MenuItem onClick={handleClose} component={Link} to="/qr-scanner">QR Scanner</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
