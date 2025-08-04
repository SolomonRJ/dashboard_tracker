import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  Dashboard as DashboardIcon,
  Map as MapIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';

const Topbar = ({ onMenuClick, mobileOpen, onMobileToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Map View', icon: <MapIcon /> },
    { text: 'Reports', icon: <TableChartIcon /> },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          height: { xs: 56, sm: 64 }, // Shorter on mobile
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: 56, sm: 64 },
            px: { xs: 1, sm: 3 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onMobileToggle}
                sx={{ mr: 1, p: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                }}
              >
                🎓
              </Box>
              <Typography 
                variant={{ xs: 'subtitle1', sm: 'h6' }}
                noWrap 
                component="div"
                sx={{ 
                  fontWeight: 500,
                  color: 'text.primary',
                  display: { xs: 'none', sm: 'block' },
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Faculty Dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1 } }}>
            <IconButton 
              color="inherit" 
              size={isMobile ? "medium" : "large"}
              sx={{ p: { xs: 1, sm: 1.5 } }}
            >
              <Notifications />
            </IconButton>
            <IconButton
              size={isMobile ? "medium" : "large"}
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ p: { xs: 1, sm: 1.5 } }}
            >
              <Avatar sx={{ 
                width: { xs: 28, sm: 32 }, 
                height: { xs: 28, sm: 32 }, 
                bgcolor: 'primary.main' 
              }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'grey.200',
          },
        }}
      >
        <Toolbar />
        <List sx={{ px: 2 }}>
          {menuItems.map((item, index) => (
            <ListItem 
              key={item.text}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Topbar;