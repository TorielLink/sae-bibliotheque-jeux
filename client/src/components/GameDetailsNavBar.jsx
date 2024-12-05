import React from 'react';

export default function GameDetailsNavBar() {
    return (
        <div style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <a href="#details" style={styles.navLink}>Détails</a>
                </li>
                <li style={styles.navItem}>
                    <a href="#reviews" style={styles.navLink}>Avis</a>
                </li>
                <li style={styles.navItem}>
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
};