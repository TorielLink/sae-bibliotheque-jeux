import React from 'react';

const Terms = () => {
    return (
        <div style={styles.page}>
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
    link: {
        color: '#0077b5',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    linkHover: {
        color: '#005580',
    },
};

export default Terms;
