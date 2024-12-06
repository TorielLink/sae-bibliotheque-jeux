import React from 'react';


export default function GameDetailsNavBar({ activeSection }) {
    // Chaque section a une couleur différente
    const getActiveColor = () => {
        switch (activeSection) {
            case "details":
                return "#9534D5B3"; // violet
            case "reviews":
                return "#FFBB33B3"; // jaune
            case "medias":
                return "#36A0FCB3"; // bleu
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
                        color: activeSection === "details" ? "#FFF" : "#333", // Détails en blanc si actif
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

const styles = {
    navbar: {
        width: '35vw', // pour que ça ne s'adapte pas à la taille du parent
        backgroundColor: '#F5F5F5',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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
        borderRadius: '5px',
        flex: '1', // pour s'assurer que chaque onglet occupe un espace équivalent
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    navLink: {
        display: 'block',
        padding: '21px 15px',
        color: '#333',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
    },
    activeNavLink: {
        color: '#FFF',
        fontWeight: 'bold',
    },
};