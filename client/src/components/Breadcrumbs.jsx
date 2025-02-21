import React from 'react';
import {Breadcrumbs, Link as MuiLink} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {NavigateNext} from "@mui/icons-material";
import {Link} from "react-router-dom";

function CustomBreadcrumbs({links, disabled}) {
    const theme = useTheme()
    const styles = getStyles(theme)

    return (
        <Breadcrumbs
            separator={<NavigateNext/>}
            style={styles.breadcrumbs}
        >
            {
                links.map((link, index) => (
                    <MuiLink
                        key={index}
                        component={Link}
                        to={link.to}
                        underline={disabled ? 'none' : "hover"}
                        sx={{
                            ...styles.breadcrumb,
                            cursor: disabled ? 'not-allowed' : 'pointer'
                        }}
                        onClick={(e) => {
                            if (disabled) e.preventDefault()
                        }}
                    >
                        {link.label}
                    </MuiLink>
                ))
            }
        </Breadcrumbs>
    )
}

const getStyles = (theme) => ({
    breadcrumbs: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.colors.red,
        margin: "2em 0 1em 2em",
    },
    breadcrumb: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.colors.red,
    }
})

export default CustomBreadcrumbs