import React from 'react';

const InstitutionPage = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>L'établissement</h1>
            <p style={styles.text}>Découvrez l'histoire et les valeurs de notre établissement.</p>
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

export default InstitutionPage;
