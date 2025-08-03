import { Grid, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((card, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{
              background: card.gradient,
              color: "white",
              borderRadius: "16px",
              p: 2,
              textAlign: "center",
              boxShadow: 6
            }}>
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>{card.value}</Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;
