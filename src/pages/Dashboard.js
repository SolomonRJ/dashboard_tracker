import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Modal,
  Typography,
  Card,
  CardContent,
  Paper,
  InputAdornment,
  Chip,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material";

import {
  Search,
  FilterList,
  Download,
  Add,
  Close,
} from "@mui/icons-material";

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
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  overflow: 'hidden',
};

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    { 
      field: "email", 
      headerName: "Student Email", 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "imageUri", 
      headerName: "Photo", 
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt="checkin"
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            cursor: "pointer",
            objectFit: 'cover',
            border: '2px solid',
            borderColor: 'grey.200',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          onClick={() => setSelectedImage(params.value)}
        />
      )
    },
    { 
      field: "latitude", 
      headerName: "Latitude", 
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value?.toFixed(4)}
        </Typography>
      ),
    },
    { 
      field: "longitude", 
      headerName: "Longitude", 
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value?.toFixed(4)}
        </Typography>
      ),
    },
    {
      field: "timestamp", 
      headerName: "Check-in Time", 
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) =>
        params.value?.toDate?.().toLocaleString() || params.value,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {format(params.value?.toDate?.() || new Date(params.value), 'MMM dd, yyyy')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(params.value?.toDate?.() || new Date(params.value), 'hh:mm a')}
          </Typography>
        </Box>
      ),
    }
  ];

  // Stats for cards
  const stats = [
    { title: "Total Check-Ins", value: filtered.length },
    { title: "Active Locations", value: new Set(filtered.map(c => c.latitude + c.longitude)).size },
    { title: "Today's Check-Ins", value: filtered.filter(c =>
        (c.timestamp?.toDate?.() || new Date(c.timestamp))
        .toDateString() === new Date().toDateString()
      ).length }
  ];

  return (
    <Box sx={{ display: "flex", minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar />
      <Topbar mobileOpen={mobileOpen} onMobileToggle={handleMobileToggle} />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 }, 
          ml: { xs: 0, md: '280px' },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 1,
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor student check-ins and attendance in real-time
            </Typography>
          </Box>

          <StatsCards stats={stats} />

          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Paper 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Filters & Search
                </Typography>
              </Box>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by email..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Filter by Date"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setDateFilter(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.paper',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      sx={{ borderRadius: 2 }}
                    >
                      <CSVLink
                        data={filtered}
                        filename={"checkins.csv"}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Export CSV
                      </CSVLink>
                    </Button>
                    {(emailFilter || dateFilter) && (
                      <Chip
                        label={`${filtered.length} results`}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Paper 
              sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Check-Ins
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filtered.length} total entries
                </Typography>
              </Box>
              
              <Box sx={{ height: 500 }}>
                <DataGrid
                  rows={filtered}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  disableSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                      borderBottom: '1px solid',
                      borderColor: 'grey.100',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'grey.50',
                      borderBottom: '1px solid',
                      borderColor: 'grey.200',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'grey.50',
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Paper 
              sx={{ 
                mt: 3,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Location Map
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Geographic distribution of check-ins
                </Typography>
              </Box>
              <Box sx={{ height: 400 }}>
                <CheckinMap checkins={filtered} />
              </Box>
            </Paper>
          </motion.div>
        </Container>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Add />
          </Fab>
        )}

        {/* Image Modal */}
        <Modal 
          open={!!selectedImage} 
          onClose={() => setSelectedImage(null)}
          sx={{ zIndex: 1300 }}
        >
          <Box sx={modalStyle}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Check-in Photo
              </Typography>
              <Button
                onClick={() => setSelectedImage(null)}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <Close />
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box
                component="img"
                src={selectedImage}
                alt="preview"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default Dashboard;