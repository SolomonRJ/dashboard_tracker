import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  TableChart as TableChartIcon,
  Analytics,
  People,
  Settings,
} from '@mui/icons-material';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, active: true },
    { text: 'Map View', icon: <MapIcon /> },
    { text: 'Reports', icon: <TableChartIcon /> },
    { text: 'Analytics', icon: <Analytics /> },
    { text: 'Students', icon: <People /> },
  ];

  const secondaryItems = [
    { text: 'Settings', icon: <Settings /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'grey.200',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            px: 2,
            mb: 1,
          }}
        >
          MAIN MENU
        </Typography>
        
        <List sx={{ mb: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={item.text}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: item.active ? 'primary.main' : 'transparent',
                color: item.active ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: item.active ? 'primary.dark' : 'grey.100',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: item.active ? 'white' : 'primary.main',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: item.active ? 600 : 500,
                  fontSize: '0.875rem',
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
            px: 2,
            mb: 1,
          }}
        >
          OTHER
        </Typography>

        <List>
          {secondaryItems.map((item, index) => (
            <ListItem
              key={item.text}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: 'text.primary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;