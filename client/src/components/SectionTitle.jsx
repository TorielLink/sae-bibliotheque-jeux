// SectionTitle.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SectionTitle = ({ title }) => {
  const theme = useTheme();

  return (
    <Box sx={{ marginBottom: '20px', paddingLeft: '0px', paddingRight: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* Rectangle autour du titre */}
        <Box
          sx={{
            border: `2px solid ${theme.palette.green.main}`,
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        {/* Ligne de séparation prolongeant le rectangle */}
        <Box
          sx={{
            flexGrow: 1,
            height: '2px',
            backgroundColor: theme.palette.green.main,
            marginLeft: '-2px',
          }}
        />
      </Box>
    </Box>
  );
};

export default SectionTitle;
