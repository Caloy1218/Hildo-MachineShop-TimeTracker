import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Tabs, Tab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Link } from 'react-router-dom';
import HMS from './Assets/Hildo-Machine-shop-Icon.jpg';
import './Header.css';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        <img className='HMS-icon' src={HMS} alt="HMS-ICON" />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
          Hildo Machine Shop
        </Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiTabs-indicator': {
              backgroundColor: '#e97619',
            }
          }}
        >
          {menuItems.map((item, index) => (
            <Tab
              key={index}
              icon={item.icon}
              label={item.text}
              component={Link}
              to={item.link}
              sx={{
                color: 'white',
                '&.Mui-selected': {
                  color: '#e97619',
                },
              }}
            />
          ))}
        </Tabs>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          className='menu-icon'
          sx={{
            ml: 2,
            display: { xs: 'block', sm: 'none' },
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
            width: 230,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 230,
            },
          }}
        >
          <List sx={{ paddingTop: '40px' }}>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.link} onClick={handleClose}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
