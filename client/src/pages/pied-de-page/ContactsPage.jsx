import React from 'react';

const ContactPage = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Contactez-nous</h1>
            <p style={styles.text}>
                Vous pouvez nous contacter via les plateformes suivantes :
            </p>

            <ul style={styles.linkList}>
                <li>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                    >
                        GitHub
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:contact-scrib@example.com"
                        style={styles.link}
                    >
                        Adresse mail
                    </a>
                </li>
                <li>
                    <a
                        href="/discord"
                        style={styles.link}
                    >
                        Discord
                    </a>
                </li>
            </ul>
        </div>
    );
};

const styles = {
    page: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        lineHeight: '1.6',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    text: {
        fontSize: '16px',
        marginBottom: '15px',
    },
    linkList: {
        listStyleType: 'none',
        padding: '0',
    },
    link: {
        display: 'block',
        color: '#0077b5',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        margin: '10px 0',
        transition: 'color 0.3s',
    },
    linkHover: {
        color: '#005580',
    },
};

export default ContactPage;
