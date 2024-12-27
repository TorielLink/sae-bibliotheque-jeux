import React from 'react';
import {useTheme} from "@mui/material/styles";


export default function GameDetailsNavBar({ activeSection }) {
    const theme = useTheme();
    const styles = getStyles(theme);

    // Chaque section a une couleur différente
    const getActiveColor = () => {
        switch (activeSection) {
            case "details":
                return theme.palette.transparentColors['purple-70']; // violet
            case "reviews":
                return theme.palette.transparentColors['yellow-70']; // jaune
            case "medias":
                return theme.palette.transparentColors['blue-70']; // bleu
            default:
                return "transparent"; // Par défaut, aucune couleur
        }
    };

    return (
        <div style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={{
                        ...styles.navItem,
                        ...(activeSection === "details" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}>
                    <a href={"#details"} style={{
                        ...styles.navLink,
                        color: activeSection === "details" ? "#FFF" : "#333", // texte en blanc si actif
                    }}>Détails</a>
                </li>
                <li style={{
                        ...styles.navItem,
                        ...(activeSection === "reviews" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}>
                    <a href={"#reviews"} style={{...styles.navLink,}}>Avis</a>
                </li>
                <li style={{
                        ...styles.navItem,
                        ...(activeSection === "medias" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}>
                    <a href={"#medias"} style={{...styles.navLink,}}>Médias</a>
                </li>
            </ul>
        </div>
    );
}

const getStyles = (theme) => ({
    navbar: {
        width: '35vw', // pour que ça ne s'adapte pas à la taille du parent
        backgroundColor: theme.palette.background.default,
        borderRadius: '0.3125rem',
        fontFamily: theme.typography.fontFamily,
        boxShadow: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        margin: 0,
        padding: 0,
    },
    navItem: {
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        borderRadius: '0.3125rem',
        flex: '1', // pour s'assurer que chaque onglet occupe un espace équivalent
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)',
    },
    navLink: {
        display: 'block',
        padding: '1.3125rem 0.9375rem',
        color: theme.palette.text.primary,
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: '500',
    },
    activeNavLink: {
        color: theme.palette.text.contrast,
        fontWeight: 'bold',
    },
});