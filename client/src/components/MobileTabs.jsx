import React, { useState } from "react";
import { Box, Tabs, Tab, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function MobileTabs({ tabTitles, tabContents }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ margin: "0.5em 0", position: "relative"}}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                centered
                textColor="primary"
                indicatorColor="blue"
                sx={{
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "0.8em",
                        margin: "0 0.5em",
                        padding: '0.5em 0.75em',
                        minHeight: "auto",
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: `0.2em solid ${theme.palette.colors.green}`,
                        borderRadius: '0.5em 0.5em 0 0',
                    },
                    "& .Mui-selected": {
                        color: theme.palette.colors.red,
                        borderBottom: 0,
                        fontWeight: "bold",
                    },
                }}
            >
                {tabTitles.map((title, index) => (
                    <Tab key={index} label={title} />
                ))}
            </Tabs>
            <hr
                style={{
                    position: "absolute",
                    width: "100%",
                    top: "1.975rem",
                    border: 'none',
                    height: '0.10em',
                    backgroundColor: theme.palette.colors.green,
                    margin: 0,
                    zIndex: 0,
                }}
            />
            {/* Affichage du contenu de l'onglet sélectionné */}
            {tabContents[selectedTab] ? (
                tabContents[selectedTab]
            ) : (
                <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            )}
        </Box>
    );
}

export default MobileTabs;
