import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import {useTheme} from "@mui/material/styles";

function PlatformIcon({icon, isChecked}) {
    const theme = useTheme()

    const IconComponent =
        FaIcons[icon] ||
        SiIcons[icon] ||
        BsIcons[icon] ||
        FaIcons.FaQuestionCircle

    return (
        <IconComponent
            size={'2em'}
            style={{
                background: isChecked ? theme.palette.background.default : 'none',
                boxShadow: isChecked ? '0 0 2px 1px #000000' : 'none',
                borderRadius: isChecked ? '0.5em' : 'none',
            }}
        />
    );
}

export default PlatformIcon