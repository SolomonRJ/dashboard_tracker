import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Chip,
  useMediaQuery,
  useTheme,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
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

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import CheckinMap from "../components/CheckinMap";

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
      try {
        const querySnapshot = await getDocs(collection(db, "checkins"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCheckins(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set some mock data for demo purposes
        const mockData = [
          {
            id: '1',
            email: 'student1@example.com',
            latitude: 12.87,
            longitude: 77.65,
            timestamp: new Date(),
            imageUri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
          },
          {
            id: '2',
            email: 'student2@example.com',
            latitude: 12.88,
            longitude: 77.66,
            timestamp: new Date(),
            imageUri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
          }
        ];
        setCheckins(mockData);
        setFiltered(mockData);
      }
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
        params.value?.toDate?.().toLocaleString() || new Date(params.value).toLocaleString(),
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
    { title: "Active Locations", value: new Set(filtered.map(c => `${c.latitude}-${c.longitude}`)).size },
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
          p: { xs: 1, sm: 2, md: 3 }, 
          ml: { xs: 0, md: '280px' },
          mt: { xs: '56px', sm: '64px' },
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
          {/* Header */}
          <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
            <Typography 
              variant={{ xs: 'h5', sm: 'h4' }}
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
            >
              Monitor student check-ins and attendance in real-time
            </Typography>
          </Box>

          <StatsCards stats={stats} />

          {/* Filters Section */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              mx: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterList sx={{ mr: 1, color: 'primary.main' }} />
              <Typography 
                variant={{ xs: 'subtitle1', sm: 'h6' }}
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Filters & Search
              </Typography>
            </Box>
            
            <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
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
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size={isMobile ? "small" : "medium"}
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
                    size={isMobile ? "small" : "medium"}
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
                      size={isMobile ? "small" : "medium"}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Data Table */}
          <Paper 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200',
              mx: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'grey.200' }}>
              <Typography 
                variant={{ xs: 'subtitle1', sm: 'h6' }}
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Recent Check-Ins
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                {filtered.length} total entries
              </Typography>
            </Box>
            
            <Box sx={{ height: { xs: 400, sm: 500 } }}>
              <DataGrid
                rows={filtered}
                columns={isMobile ? mobileColumns : columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 },
                  },
                }}
                pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25]}
                disableRowSelectionOnClick
                density={isMobile ? "compact" : "standard"}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '4px 8px', sm: '8px 16px' },
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'grey.50',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid',
                    borderColor: 'grey.200',
                  },
                }}
              />
            </Box>
          </Paper>

          {/* Map Section */}
          <Paper 
            sx={{ 
              mt: { xs: 2, sm: 3 },
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200',
              mx: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'grey.200' }}>
              <Typography 
                variant={{ xs: 'subtitle1', sm: 'h6' }}
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Location Map
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                Geographic distribution of check-ins
              </Typography>
            </Box>
            <Box sx={{ height: { xs: 300, sm: 400 } }}>
              <CheckinMap checkins={filtered} />
            </Box>
          </Paper>
        </Container>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            size="medium"
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
        <Dialog 
          open={!!selectedImage} 
          onClose={() => setSelectedImage(null)}
          maxWidth={isMobile ? "sm" : "md"}
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Check-in Photo
            </Typography>
            <IconButton onClick={() => setSelectedImage(null)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 1, sm: 3 } }}>
            <Box
              component="img"
              src={selectedImage}
              alt="preview"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                maxHeight: { xs: '60vh', sm: '70vh' },
                objectFit: 'contain',
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
  // Mobile-optimized columns for DataGrid
  const mobileColumns = [
    { 
      field: "email", 
      headerName: "Student", 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
            {params.value?.split('@')[0]}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            {params.value?.split('@')[1]}
          </Typography>
        </Box>
      ),
    },
    {
      field: "imageUri", 
      headerName: "Photo", 
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value}
          alt="checkin"
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            cursor: "pointer",
            objectFit: 'cover',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
          onClick={() => setSelectedImage(params.value)}
        />
      )
    },
    {
      field: "timestamp", 
      headerName: "Time", 
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) =>
        params.value?.toDate?.().toLocaleString() || new Date(params.value).toLocaleString(),
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
            {format(params.value?.toDate?.() || new Date(params.value), 'MMM dd')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            {format(params.value?.toDate?.() || new Date(params.value), 'hh:mm a')}
          </Typography>
        </Box>
      ),
    }
  ];


export default Dashboard;
