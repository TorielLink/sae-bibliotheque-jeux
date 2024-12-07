import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Politique & confidentialité</h1>
            <p style={styles.text}>Découvrez comment nous protégeons vos données personnelles.</p>
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

export default PrivacyPolicy;
