import React from 'react';
import { Grid, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
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
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((card, idx) => {
        const IconComponent = icons[idx];
        const color = colors[idx];
        
        return (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
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
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 1,
                      fontSize: '2rem',
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
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 16 }} />
                      +12%
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      vs last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;