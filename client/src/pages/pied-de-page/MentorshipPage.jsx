import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const MentorshipPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linksContainer}>
                    <a href="/project" style={styles.mobileLink}>
                        Voir le projet
                    </a>
                </div>
            )}

            <h1 style={styles.header}>L'encadrement</h1>
            <p style={styles.text}>
                Ce projet bénéficie de l'accompagnement d'un mentor expérimenté et du soutien d'investisseurs engagés.
            </p>

            {/* Section : Mentor */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #FE4A49'}}>Notre professeur référent</h2>
                <div style={{ ...styles.mentor, flexDirection: isMobile ? 'column' : 'row' }}>
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Jérôme FESSY"
                        style={styles.image}
                    />
                    <div>
                        <h3 style={styles.mentorName}>Jérôme FESSY</h3>
                        <p style={styles.mentorRole}>
                            Maître de Conférences et Chef du Département Informatique, IUT de
                            Paris
                        </p>
                        <p style={styles.text}>
                            Monsieur Fessy joue un rôle clef dans l'encadrement de ce projet. Avec une expertise
                            approfondie en informatique et une passion pour la pédagogie, il fournit des conseils
                            précieux et un soutien académique de qualité.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section : Investisseurs */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #FFBB33'}}>Nos investisseurs</h2>
                <div style={styles.investors}>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor1.png"
                            alt="Investisseur"
                            style={styles.investorImage}
                        />
                        <h4 style={styles.investorName}>Alex Dupont</h4>
                        <p style={styles.investorRole}>CEO, StartupTech</p>
                    </div>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor2.png"
                            alt="Investisseur"
                            style={styles.investorImage}
                        />
                        <h4 style={styles.investorName}>Marie Leblanc</h4>
                        <p style={styles.investorRole}>Fondatrice, InnovInvest</p>
                    </div>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor3.png"
                            alt="Investisseur"
                            style={styles.investorImage}
                        />
                        <h4 style={styles.investorName}>Julien Moreau</h4>
                        <p style={styles.investorRole}>Partner, Future Ventures</p>
                    </div>
                </div>
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
        marginBottom: '20px',
        color: '#333',
    },
    text: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '30px',
    },
    subHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#222',
        marginBottom: '10px',
        paddingBottom: '5px',
    },
    mentor: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    image: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    mentorName: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '0',
        color: '#222',
    },
    mentorRole: {
        fontSize: '14px',
        color: '#777',
        margin: '3px 0 10px 0',
    },
    investors: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    investorCard: {
        textAlign: 'center',
        flex: '1',
        minWidth: '120px',
        maxWidth: '180px',
    },
    investorImage: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
    },
    investorName: {
        fontSize: '16px',
        fontWeight: 'bold',
        margin: '0',
        color: '#222',
    },
    investorRole: {
        fontSize: '14px',
        color: '#777',
        margin: '3px 0 10px 0',
    },
    mobileLink: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#007BFF',
        textDecoration: 'none',
        border: '1px solid #007BFF',
        padding: '4px 8px',
        borderRadius: '5px',
        transition: 'background-color 0.3s, color 0.3s',
    },
};

export default MentorshipPage;
