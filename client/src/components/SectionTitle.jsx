// SectionTitle.jsx
import React from 'react';
import {Box, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';

const SectionTitle = ({title}) => {
    const theme = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            padding: "0 1.5em",
            alignItems: 'flex-end',
        }}>

            {/* Rectangle autour du titre */}
            <Box
                sx={{
                    border: `0.2em solid ${theme.palette.colors.green}`,
                    borderRadius: '0.5em 0.5em 0 0',
                    padding: '0.25em 0.75em',
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Typography variant="h6" sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 'bold'
                }}>
                    {title}
                </Typography>
            </Box>

            {/* Ligne de séparation prolongeant le rectangle */}
            <Box
                sx={{
                    flexGrow: 1,
                    height: '0.2em',
                    backgroundColor: theme.palette.colors.green,
                }}
            />
        </Box>
    );
};

export default SectionTitle;
