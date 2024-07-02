import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Link } from 'react-router-dom';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/' },
    { text: 'Members', icon: <GroupIcon />, link: '/members' },
    { text: 'Logs', icon: <ReceiptIcon />, link: '/logs' },
    { text: 'QR Scanner', icon: <QrCodeIcon />, link: '/qr-scanner' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hildo Machine Shop
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          className='menu-icon'
          sx={{
            mr: 2,
            display: { xs: 'block', sm: 'none',margin: '0px',paddingRight:'0px'},
          }}
        >
          <MenuIcon />
        </IconButton>
        {/* Drawer for mobile view */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleClose}
          className='drawer'
          sx={{
            width: 230, // Adjust the width of the Drawer as needed
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 230,
            },
          }}
        >
          <List sx={{paddingTop: '40px'}}>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.link} onClick={handleClose}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        {/* Menu for desktop view */}
        <Menu
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={null}
          open={false}
          onClose={handleClose}
          onClick={handleClose}
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} component={Link} to={item.link} onClick={handleClose}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
