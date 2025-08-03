import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import TableChartIcon from "@mui/icons-material/TableChart";
import React from "react";

const Sidebar = () => {
  return (
    <Drawer variant="permanent" sx={{ width: 220, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box", background: "#1E1E2F", color: "white" } }}>
      <List>
        <ListItem button>
          <ListItemIcon><DashboardIcon sx={{ color: "white" }}/></ListItemIcon>
          <ListItemText primary="Dashboard"/>
        </ListItem>
        <ListItem button>
          <ListItemIcon><MapIcon sx={{ color: "white" }}/></ListItemIcon>
          <ListItemText primary="Map View"/>
        </ListItem>
        <ListItem button>
          <ListItemIcon><TableChartIcon sx={{ color: "white" }}/></ListItemIcon>
          <ListItemText primary="Reports"/>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
