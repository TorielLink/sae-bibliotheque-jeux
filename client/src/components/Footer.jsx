import React from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Footer = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <footer style={styles.footerContainer}>
            {!isMobile && (
                <div style={styles.footerContent}>
                    {/* Section : À propos de nous */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>À propos de nous</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/team" style={styles.link}>L'équipe</a></li>
                            <li><a href="/institution" style={styles.link}>L'établissement</a></li>
                        </ul>
                    </div>

                    {/* Section : À propos du projet */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>À propos du projet</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/project" style={styles.link}>Le projet</a></li>
                            <li><a href="/mentorship" style={styles.link}>L'encadrement</a></li>
                            <li><a href="https://github.com/TorielLink/BibliothequeJeuxIUT" target="_blank"
                                   rel="noopener noreferrer" style={styles.link}>Dépôt GitHub</a></li>
                        </ul>
                    </div>

                    {/* Section : Confidentialité */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>Confidentialité</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/terms" style={styles.link}>Termes & conditions</a></li>
                            <li><a href="/privacy-policy" style={styles.link}>Politique & confidentialité</a></li>
                        </ul>
                    </div>

                    {/* Section : Contact */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>Contact</h3>
                        <ul style={styles.linkList}>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" style={styles.link}>GitHub</a></li>
                            <li><a href="mailto:contact-srcib@example.com" style={styles.link}>Adresse mail</a></li>
                            <li><a href="/discord" style={styles.link}>Discord</a></li>
                        </ul>
                    </div>
                </div>
                )}

            {isMobile && (
                <div style={styles.mobileFooterContent}>
                    {/* Section : Nous */}
                    <div style={styles.column}>
                        <a href="/team" style={styles.link}>Équipe</a>
                    </div>

                    {/* Section : Projet */}
                    <div style={styles.column}>
                        <a href="/project" style={styles.link}>Projet</a>
                    </div>

                    {/* Section : Confidentialité */}
                    <div style={styles.column}>
                        <a href="/privacy-policy" style={styles.link}>Confidentialité</a>
                    </div>

                    {/* Section : Contact */}
                    <div style={styles.column}>
                        <a href="/contact" style={styles.link}>Contact</a>
                    </div>
                </div>
            )}

            <hr style={styles.separator}/>

            {/* Bas de page */}
            <div style={styles.footerBottom}>
                <p style={styles.bottomText}>Tous droits réservés © 2024</p>
            </div>
        </footer>
    );
};

const getStyles = (theme) => ({
    footerContainer: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text,
        padding: '40px 20px',
        marginTop: '20px',
        fontFamily: theme.typography.fontFamily,
    },
    footerContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: '60px',
        paddingInline: '12%',
    },
    mobileFooterContent: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0 5%',
        textAlign: 'center',
    },
    column: {
        flex: '1',
        textAlign: 'center',
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        fontSize: '14px',
        lineHeight: '1.8',
        transition: 'color 0.3s',
        cursor: 'pointer',
    },
    linkHover: {
        color: theme.palette.text.secondary,
    },
    separator: {
        border: 'none',
        borderTop: '1px solid ' + theme.palette.text.secondary,
        margin: '20px auto',
        width: '90%',
    },
    footerBottom: {
        textAlign: 'center',
    },
    bottomText: {
        fontSize: '14px',
        fontWeight: 'medium',
        color: theme.palette.text.secondary,
    },
});

export default Footer;