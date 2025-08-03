import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";

const Topbar = ({ toggleDarkMode }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, background: "#6D5BBA" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div">
          🎓 Faculty Dashboard
        </Typography>
        <div>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            <Brightness4Icon/>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircleIcon/>
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
