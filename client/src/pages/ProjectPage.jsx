import React from 'react';

const ProjectPage = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>Le projet</h1>
            <p style={styles.text}>Cette page détaille les objectifs et la mission de notre projet.</p>
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

export default ProjectPage;
