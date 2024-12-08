import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={styles.page}>
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

const styles = {
    page: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    subHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#555',
    },
    text: {
        fontSize: '16px',
        marginBottom: '15px',
    },
    section: {
        marginBottom: '20px',
    },
    list: {
        marginLeft: '20px',
        listStyleType: 'disc',
    },
    link: {
        color: '#0077b5',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    linkHover: {
        color: '#005580',
    },
};

export default PrivacyPolicy;
