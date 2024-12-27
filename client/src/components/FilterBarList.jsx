import React from 'react';
import {useTheme} from '@mui/material/styles';
import {Box, Tab, Tabs, useMediaQuery} from '@mui/material';

export default function FilterBarList({filters, selectedFilter, onFilterChange}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newIndex) => {
        onFilterChange(filters[newIndex].id);
    };

    const getFilterColor = (filterId) => {
        switch (filterId) {
            case 'finish':
                return theme.palette.colors.purple;
            case 'playing':
                return theme.palette.colors.yellow;
            case 'library':
                return theme.palette.colors.blue;
            case 'wishlist':
                return theme.palette.colors.green;
            case 'paused':
                return theme.palette.colors.lightGray;
            case 'stopped':
                return theme.palette.colors.red;
            default:
                return '#FFFFFF';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'flex-start' : 'center',
                width: '100%',
                
                padding: isMobile ? '0 0.5em' : '0',
            }}
        >
            {isMobile ? (
                <Tabs
                    value={filters.findIndex((filter) => filter.id === selectedFilter)}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        width: '100%',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                            margin: '0 0.5em',
                            padding: '0.5em 0.75em',
                            minHeight: 'auto',
                            backgroundColor: '#FFFFFF',
                            border: `0.2em solid ${theme.palette.colors?.green || '#00FF00'}`,
                            borderRadius: '0.5em 0.5em 0 0',
                            color: '#555555',
                        },
                        '& .Mui-selected': {
                            color: theme.palette.colors?.red || '#FF0000',
                        },
                    }}
                >
                    {filters.map((filter) => (
                        <Tab
                            key={filter.id}
                            label={filter.label}
                            sx={{
                                backgroundColor: selectedFilter === filter.id ? getFilterColor(filter.id) : '#FFFFFF',
                            }}
                        />
                    ))}
                </Tabs>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        border: '0.0625em solid #D0D0D0',
                        borderRadius: '0.3125em',
                        overflow: 'hidden',
                        boxShadow: '0em 0em 0.3125em rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {filters.map((filter, index) => (
                        <Box
                            key={filter.id}
                            onClick={() => onFilterChange(filter.id)}
                            sx={{
                                flex: '1 1 auto',
                                textAlign: 'center',
                                cursor: 'pointer',
                                padding: '0.625em 1.25em',
                                fontWeight: selectedFilter === filter.id ? 'bold' : 'normal',
                                color: selectedFilter === filter.id ? '#000000' : '#555555',
                                backgroundColor: selectedFilter === filter.id ? getFilterColor(filter.id) : '#FFFFFF',
                                borderLeft: index > 0 ? '0.0625em solid #D0D0D0' : 'none',
                                borderRight: index < filters.length - 1 ? '0.0625em solid #D0D0D0' : 'none',
                                '&:hover': {
                                    backgroundColor: selectedFilter === filter.id
                                        ? getFilterColor(filter.id)
                                        : '#F0F0F0',
                                },
                            }}
                        >
                            {filter.label}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
