import React from 'react';

const MentorshipPage = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>L'encadrement</h1>
            <p style={styles.text}>Informations sur les mentors et les personnes qui soutiennent ce projet.</p>
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

export default MentorshipPage;
