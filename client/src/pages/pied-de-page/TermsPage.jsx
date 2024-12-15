import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Terms = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linkContainer}>
                    <a href="/privacy-policy" style={styles.mobileLink}>
                        Voir la politique de confidentialité
                    </a>
                </div>
            )}

            <h1 style={styles.header}>Termes & conditions</h1>
            <section style={styles.section}>
                <h2 style={styles.subHeader}>1. Introduction</h2>
                <p style={styles.text}>
                    Bienvenue sur notre plateforme. En accédant ou en utilisant notre service, vous acceptez les termes et conditions suivants.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>2. Utilisation de la plateforme</h2>
                <p style={styles.text}>
                    Vous vous engagez à utiliser notre plateforme conformément aux lois et réglementations en vigueur. Toute utilisation abusive ou illégale est interdite.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>3. Propriété intellectuelle</h2>
                <p style={styles.text}>
                    Tous les contenus présents sur ce site (textes, images, logos, etc.) sont protégés par les lois relatives à la propriété intellectuelle. Vous ne pouvez pas les utiliser sans notre autorisation écrite préalable.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>4. Limitation de responsabilité</h2>
                <p style={styles.text}>
                    Nous ne sommes pas responsables des dommages directs ou indirects pouvant découler de l'utilisation de notre plateforme.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>5. Modifications</h2>
                <p style={styles.text}>
                    Nous nous réservons le droit de modifier ces termes et conditions à tout moment. Les modifications seront effectives dès leur publication sur cette page.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>6. Contact</h2>
                <p style={styles.text}>
                    Pour toute question concernant ces termes et conditions, veuillez nous contacter à <a href="mailto:contact-scrib@example.com" style={styles.link}>contact-scrib@example.com</a>.
                </p>
            </section>
        </div>
    );
};

const getStyles = (theme) => ({
    page: {
        padding: '1.25rem',
        fontFamily: theme.typography.fontFamily,
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
    },
    text: {
        fontSize: '1rem',
        color: theme.palette.text.primary,
        marginBottom: '1.25rem',
    },
    section: {
        marginBottom: '1.875rem',
    },
    subHeader: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
        paddingBottom: '0.3125rem',
    },
    link: {
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        margin: '0.625rem 0',
        transition: 'color 0.3s',
    },
    linkHover: {
        color: '#005580',
    },
    mobileLink: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        border: '1px solid ' + theme.palette.colors.blue,
        padding: '0.25rem 0.5rem',
        borderRadius: '0.3125rem',
        transition: 'background-color 0.3s, color 0.3s',
    },
});

export default Terms;
