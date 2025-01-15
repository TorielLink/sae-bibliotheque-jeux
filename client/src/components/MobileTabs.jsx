import React, {useState} from "react";
import {Box, CircularProgress, Tab, Tabs} from "@mui/material";
import {useTheme} from "@mui/material/styles";

function MobileTabs({tabTitles, tabContents}) {
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{margin: "0.5em 0", position: "relative"}}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant={tabTitles.length > 4 ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                    "& .MuiTabs-flexContainer": {
                        display: "flex",
                        justifyContent: tabTitles.length > 4 ? "flex-start" : "center",
                    },
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                        margin: "0 0.5em",
                        padding: "0.5em 0.75em",
                        minHeight: "auto",
                        minWidth: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        whiteSpace: "normal",
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        border: `0.2em solid ${theme.palette.colors.green || "#00FF00"}`,
                        borderRadius: "0.5em 0.5em 0 0",
                    },
                    "& .Mui-selected": {
                        color: theme.palette.colors.red || "#FF0000",
                        fontWeight: "bold",
                    },
                }}
            >
                {tabTitles.map((title, index) => (
                    <Tab key={index} label={title}/>
                ))}
            </Tabs>
            <hr
                style={{
                    position: "absolute",
                    width: "100%",
                    top: "1.975rem",
                    border: "none",
                    height: "0.10em",
                    backgroundColor: theme.palette.colors.green || "#00FF00",
                    margin: 0,
                    zIndex: 0,
                }}
            />
            <Box sx={{marginTop: "1rem"}}>
                {tabContents[selectedTab] ? (
                    tabContents[selectedTab]
                ) : (
                    <CircularProgress sx={{display: "block", margin: "auto"}}/>
                )}
            </Box>
        </Box>
    );
}

export default MobileTabs;
