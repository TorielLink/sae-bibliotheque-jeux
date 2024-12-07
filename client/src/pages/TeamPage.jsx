import React from 'react';

const TeamPage = () => {
    const teamMembers = [
        {
            name: 'Valentin Amoros',
            role: 'Développeur Frontend et 3D',
            github: 'https://github.com/Vegaliite',
            linkedin: 'https://linkedin.com/in/alicedupont',
            twitter: 'https://twitter.com/alicedupont',
        },
        {
            name: 'Nicolas Estermann',
            role: 'Développeur Fullstack',
            github: 'https://github.com/Legallait',
            linkedin: 'https://linkedin.com/in/bobmartin',
            twitter: 'https://twitter.com/bobmartin',
        },
        {
            name: 'Mya Fernandez',
            role: 'Développeuse Frontend et UI/UX Designer',
            github: 'https://github.com/G4iaa04',
            linkedin: 'https://linkedin.com/in/clairemoreau',
            twitter: 'https://twitter.com/clairemoreau',
        },
        {
            name: 'Clément Séfrin',
            role: 'Gestionnaire API et UI/UX Designer',
            github: 'https://github.com/ClementSefrin',
            linkedin: 'https://linkedin.com/in/davidlemoine',
            twitter: 'https://twitter.com/davidlemoine',
        },
        {
            name: 'Clothilde Proux',
            role: 'Développeuse Frontend et UI/UX Designer',
            github: 'https://github.com/TorielLink',
            linkedin: 'https://linkedin.com/in/emmaleroy',
            twitter: 'https://twitter.com/emmaleroy',
        },
        {
            name: 'Baanusha Sivasekaran',
            role: 'Développeuse Frontend et Analyste en données',
            github: 'https://github.com/BaanuSha',
            linkedin: 'https://linkedin.com/in/fabricerousseau',
            twitter: 'https://twitter.com/fabricerousseau',
        },
    ];

    return (
        <div style={styles.page}>
            <h1 style={styles.header}>L'équipe</h1>
            <p style={styles.text}>Découvrez les membres qui contribuent à ce projet.</p>

            <div style={styles.teamContainer}>
                {teamMembers.map((member, index) => (
                    <div key={index} style={styles.card}>
                        <h3 style={styles.memberName}>{member.name}</h3>
                        <p style={styles.memberRole}>{member.role}</p>
                        <div style={styles.socialLinks}>
                            <a href={member.github} target="_blank" rel="noopener noreferrer" style={styles.socialIcon}>
                                <img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" alt="GitHub"/>
                            </a>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                               style={styles.socialIcon}>
                                <img src="https://img.icons8.com/ios-filled/30/0077b5/linkedin.png" alt="LinkedIn"/>
                            </a>
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                               style={styles.socialIcon}>
                                <img src="https://img.icons8.com/ios-filled/30/1da1f2/twitter.png" alt="Twitter"/>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
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
        marginBottom: '20px',
    },
    teamContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
    },
    card: {
        width: '250px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        backgroundColor: '#fff',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardHover: {
        transform: 'scale(1.05)',
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
    },
    memberName: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    memberRole: {
        fontSize: '14px',
        color: '#777',
        marginBottom: '10px',
    },
    socialLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    socialIcon: {
        display: 'inline-block',
        transition: 'opacity 0.3s',
    },
    socialIconHover: {
        opacity: 0.8,
    },
};

export default TeamPage;
