import React from 'react';
import { Grid, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import {
  TrendingUp,
  LocationOn,
  Today,
  MoreVert,
} from '@mui/icons-material';

const StatsCards = ({ stats }) => {
  const icons = [TrendingUp, LocationOn, Today];
  const colors = ['primary', 'success', 'warning'];

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
      {stats.map((card, idx) => {
        const IconComponent = icons[idx];
        const color = colors[idx];
        
        return (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-4px)' },
                  boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      borderRadius: 2,
                      backgroundColor: `${color}.main`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <IconComponent />
                  </Box>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <MoreVert />
                  </IconButton>
                </Box>
                
                <Typography
                  variant={{ xs: 'h4', sm: 'h3' }}
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                  }}
                >
                  {card.value.toLocaleString()}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {card.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'success.main',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 } }} />
                    +12%
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    }}
                  >
                    vs last week
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;