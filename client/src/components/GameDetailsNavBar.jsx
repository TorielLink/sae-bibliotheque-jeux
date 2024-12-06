import React from 'react';

/*TODO:
 *    - Changer le style (correspondre à la maquette)
 */
export default function GameDetailsNavBar({ activeSection }) {
    // Chaque section a une couleur différente
    const getActiveColor = () => {
        switch (activeSection) {
            case "details":
                return "#800080"; // Violet
            case "reviews":
                return "#FFD700"; // Jaune
            case "medias":
                return "#1E90FF"; // Bleu
            default:
                return "transparent"; // Par défaut, aucune couleur
        }
    };

    return (
        <div style={styles.navbar}>
            <ul style={styles.navList}>
                <li
                    style={{
                        ...styles.navItem,
                        ...(activeSection === "details" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}
                >
                    <a href="#details" style={styles.navLink}>Détails</a>
                </li>
                <li
                    style={{
                        ...styles.navItem,
                        ...(activeSection === "reviews" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}
                >
                    <a href="#reviews" style={styles.navLink}>Avis</a>
                </li>
                <li
                    style={{
                        ...styles.navItem,
                        ...(activeSection === "medias" ? { ...styles.activeNavItem, backgroundColor: getActiveColor() } : {}),
                    }}
                >
                    <a href="#medias" style={styles.navLink}>Médias</a>
                </li>
            </ul>
        </div>
    );
}

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'space-around',
        margin: 0,
        padding: 0,
    },
    navItem: {
        padding: '5px 15px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        display: 'block',
        padding: '5px 10px',
    },
    navLinkHover: {
        color: '#f4f4f4',
    },
    activeNavItem: {
        borderRadius: '5px',
        color: 'white',
    },
};