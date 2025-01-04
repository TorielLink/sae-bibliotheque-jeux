import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const PrivacyPolicy = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linkContainer}>
                    <a href="/terms" style={styles.mobileLink}>
                        Voir les conditions d'utilisation
                    </a>
                </div>
            )}

            <h1 style={styles.header}>Politique & confidentialité</h1>
            <section style={styles.section}>
                <h2 style={styles.subHeader}>1. Introduction</h2>
                <p style={styles.text}>
                    La protection de vos données personnelles est une priorité pour nous. Cette page détaille comment nous collectons, utilisons et protégeons vos informations.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>2. Données collectées</h2>
                <p style={styles.text}>
                    Nous collectons les données suivantes lorsque vous utilisez notre plateforme :
                </p>
                <ul style={styles.list}>
                    <li>Informations personnelles : nom, e-mail, etc.</li>
                    <li>Données d’utilisation : pages consultées, temps passé sur le site, etc.</li>
                    <li>Informations techniques : adresse IP, type de navigateur, etc.</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>3. Utilisation des données</h2>
                <p style={styles.text}>
                    Les données collectées sont utilisées pour :
                </p>
                <ul style={styles.list}>
                    <li>Améliorer votre expérience utilisateur.</li>
                    <li>Envoyer des communications pertinentes.</li>
                    <li>Analyser et optimiser les performances de la plateforme.</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>4. Partage des données</h2>
                <p style={styles.text}>
                    Vos données ne sont jamais vendues à des tiers. Cependant, elles peuvent être partagées avec :
                </p>
                <ul style={styles.list}>
                    <li>Fournisseurs de services tiers (hébergement, analyse de données).</li>
                    <li>Autorités légales, si requis par la loi.</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>5. Sécurité</h2>
                <p style={styles.text}>
                    Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre les accès non autorisés, la perte ou l’altération.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>6. Vos droits</h2>
                <p style={styles.text}>
                    Conformément au RGPD (ou toute législation locale), vous avez les droits suivants :
                </p>
                <ul style={styles.list}>
                    <li>Accéder à vos données personnelles.</li>
                    <li>Demander la modification ou la suppression de vos données.</li>
                    <li>Vous opposer à l’utilisation de vos données à des fins spécifiques.</li>
                </ul>
                <p style={styles.text}>
                    Pour exercer vos droits, contactez-nous à <a href="mailto:privacy-scrib@example.com" style={styles.link}>privacy-scrib@example.com</a>.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.subHeader}>7. Modifications</h2>
                <p style={styles.text}>
                    Cette politique de confidentialité peut être mise à jour périodiquement. Nous vous encourageons à consulter cette page régulièrement pour rester informé des changements.
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
    list: {
        listStyleType: 'disc',
        paddingLeft: '1.25rem',
        marginTop: '0.625rem',
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

export default PrivacyPolicy;
