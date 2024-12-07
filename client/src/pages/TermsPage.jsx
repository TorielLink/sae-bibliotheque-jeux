import React from 'react';

const Terms = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Termes & conditions</h1>
            <p style={styles.text}>Lisez nos termes et conditions pour utiliser notre plateforme.</p>
        </div>
    );
};

const styles = {
    page: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    text: {
        fontSize: '16px',
        color: '#555',
    },
};

export default Terms;
