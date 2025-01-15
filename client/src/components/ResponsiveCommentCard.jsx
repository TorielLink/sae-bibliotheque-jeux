// ResponsiveCommentCard.jsx
import React from "react";
import {useTheme, useMediaQuery} from "@mui/material";
import PCCommentCard from "./PCCommentCard";
import MobileCommentCard from "./MobileCommentCard";

/**
 * Ce composant rend la version PC si on est au-dessus de "md",
 */
export default function ResponsiveCommentCard(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    if (isMobile) {
        return <MobileCommentCard {...props} />;
    } else {
        return <PCCommentCard {...props} />;
    }
}
