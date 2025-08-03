import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  Box, Container, Grid, TextField, Button, Modal, Typography, Card, CardContent
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import { format } from "date-fns";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import CheckinMap from "../components/CheckinMap";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 2,
};

function Dashboard() {
  const [checkins, setCheckins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch Firestore data
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "checkins"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCheckins(data);
      setFiltered(data);
    };
    fetchData();
  }, []);

  // Filtering
  useEffect(() => {
    let data = checkins;
    if (emailFilter) {
      data = data.filter(c => c.email?.toLowerCase().includes(emailFilter.toLowerCase()));
    }
    if (dateFilter) {
      data = data.filter(c => {
        const date = c.timestamp?.toDate?.() || new Date(c.timestamp);
        return format(date, 'yyyy-MM-dd') === dateFilter;
      });
    }
    setFiltered(data);
  }, [emailFilter, dateFilter, checkins]);

  // Columns for DataGrid
  const columns = [
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "imageUri", headerName: "Photo", flex: 0.6,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="checkin"
          style={{ width: 40, height: 40, borderRadius: 5, cursor: "pointer" }}
          onClick={() => setSelectedImage(params.value)}
        />
      )
    },
    { field: "latitude", headerName: "Lat", flex: 0.5 },
    { field: "longitude", headerName: "Long", flex: 0.5 },
    {
      field: "timestamp", headerName: "Timestamp", flex: 1,
      valueFormatter: (params) =>
        params.value?.toDate?.().toLocaleString() || params.value
    }
  ];

  // Stats for cards
  const stats = [
    { title: "Total Check-Ins", value: filtered.length, gradient: "linear-gradient(135deg, #6D5BBA, #8D58BF)" },
    { title: "Active Locations", value: new Set(filtered.map(c => c.latitude + c.longitude)).size, gradient: "linear-gradient(135deg, #FF6A88, #FF99AC)" },
    { title: "Today", value: filtered.filter(c =>
        (c.timestamp?.toDate?.() || new Date(c.timestamp))
        .toDateString() === new Date().toDateString()
      ).length, gradient: "linear-gradient(135deg, #42E695, #3BB2B8)" }
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: "220px" } }}>
        <Topbar />
        <ToolbarSpacer />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <StatsCards stats={stats} />

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth label="Search by Email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth type="date"
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary">
                <CSVLink
                  data={filtered}
                  filename={"checkins.csv"}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Export CSV
                </CSVLink>
              </Button>
            </Grid>
          </Grid>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{ mb: 4, borderRadius: "12px", boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Check-Ins Table</Typography>
                <div style={{ width: "100%" }}>
                  <DataGrid
                    rows={filtered}
                    columns={columns}
                    autoHeight
                    disableSelectionOnClick
                    pageSize={8}
                    rowsPerPageOptions={[5, 8, 20]}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h6" gutterBottom>Map View</Typography>
            <CheckinMap checkins={filtered} />
          </motion.div>
        </Container>

        {/* Image Modal */}
        <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
          <Box sx={modalStyle}>
            <img src={selectedImage} alt="preview" style={{ width: "100%", borderRadius: "8px" }} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

// Spacer to offset fixed topbar
const ToolbarSpacer = () => <Box sx={{ height: 64 }} />;

export default Dashboard;
