import React, {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {Box, useMediaQuery} from '@mui/material';

export default function FilterBarList({filters, selectedFilter, onFilterChange}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [selectedTab, setSelectedTab] = useState(0);

    const currentIndex = filters.findIndex((f) => f.id === selectedFilter);
    const tabValue = currentIndex >= 0 ? currentIndex : 0;

    const handleTabChange = (event, newIndex) => {
        setSelectedTab(newIndex);
        onFilterChange(filters[newIndex].id);
    };

    const getFilterColor = (filterId) => {
        switch (filterId) {
            case 'finish':
                return '#D6BBFB';
            case 'playing':
                return '#FFEEAA';
            case 'library':
                return '#AEC6FF';
            case 'wishlist':
                return '#C8F7C8';
            case 'paused':
                return '#FFDFAF';
            case 'stopped':
                return '#FFBABA';
            default:
                return '#FFFFFF';
        }
    };

    return (
        <Box
            sx={{
                display: isMobile ? 'block' : 'flex',
                justifyContent: isMobile ? 'center' : 'space-between',
                alignItems: 'center',
                width: '100%',
                border: isMobile ? 'none' : '0.0625em solid #D0D0D0',
                borderRadius: '0.3125em',
                overflow: 'hidden',
                boxShadow: isMobile ? 'none' : '0em 0em 0.3125em rgba(0, 0, 0, 0.1)',
                backgroundColor: '#FFFFFF',
            }}
        >
            {isMobile && (
                <Box
                    sx={{
                        margin: '0.5em 0',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)', // 2 colonnes en version mobile
                        gap: '0.5em', // Espacement entre les items
                    }}
                >
                    {filters.map((filterItem) => (
                        <Box
                            key={filterItem.id}
                            onClick={() => onFilterChange(filterItem.id)}
                            sx={{
                                textAlign: 'center',
                                cursor: 'pointer',
                                padding: '0.5em',
                                fontWeight: selectedFilter === filterItem.id ? 'bold' : 'normal',
                                color: selectedFilter === filterItem.id ? '#000000' : '#555555',
                                backgroundColor: selectedFilter === filterItem.id ? getFilterColor(filterItem.id) : '#FFFFFF',
                                border: `0.125em solid ${theme.palette.colors?.green || '#00FF00'}`,
                                borderRadius: '0.5em',
                                boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    backgroundColor: '#F0F0F0',
                                },
                            }}
                        >
                            {filterItem.label}
                        </Box>
                    ))}
                </Box>
            )}

            {!isMobile &&
                filters.map((filter, index) => (
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
                                backgroundColor: '#F0F0F0',
                            },
                        }}
                    >
                        {filter.label}
                    </Box>
                ))}
        </Box>
    );
}
