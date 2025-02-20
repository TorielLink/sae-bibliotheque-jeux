import React from 'react';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from 'react-i18next';

const TeamPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    const teamMembers = [
        {
            name: 'Valentin Amoros',
            role: t("team.roles.devFront&3D"),
            github: 'https://github.com/Vegaliite',
            linkedin: 'https://linkedin.com/in/alicedupont',
            twitter: 'https://twitter.com/alicedupont',
        },
        {
            name: 'Nicolas Estermann',
            role: t("team.roles.devFull"),
            github: 'https://github.com/Legallait',
            linkedin: 'https://linkedin.com/in/bobmartin',
            twitter: 'https://twitter.com/bobmartin',
        },
        {
            name: 'Mya Fernandez',
            role: t("team.roles.devFront&UXUI"),
            github: 'https://github.com/G4iaa04',
            linkedin: 'https://linkedin.com/in/clairemoreau',
            twitter: 'https://twitter.com/clairemoreau',
        },
        {
            name: 'Clément Séfrin',
            role: t("team.roles.devAPI&UXUI"),
            github: 'https://github.com/ClementSefrin',
            linkedin: 'https://linkedin.com/in/clement-sefrin',
        },
        {
            name: 'Clothilde Proux',
            role: t("team.roles.devFront&UXUI"),
            github: 'https://github.com/TorielLink',
            linkedin: 'https://linkedin.com/in/clothilde-proux-0358a1250',
        },
        {
            name: 'Baanusha Sivasekaran',
            role: t("team.roles.devFront&DB"),
            github: 'https://github.com/BaanuSha',
            linkedin: 'https://linkedin.com/in/fabricerousseau',
            twitter: 'https://twitter.com/fabricerousseau',
        },
    ];

    return (
        <div style={styles.page}>
            {isMobile && (
                <div>
                    <a href="/institution" style={styles.mobileLink}>
                        {t("team.discoverInst")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("footer.team")}</h1>
            <p style={styles.text}>{t("team.discoverTeam")}</p>

            <div style={styles.teamContainer}>
                {teamMembers.map((member, index) => (
                    <div key={index} style={styles.card}>
                        <h3 style={styles.memberName}>{member.name}</h3>
                        <p style={styles.memberRole}>{member.role}</p>
                        <div style={styles.socialLinks}>
                            {member.github && (
                                <a href={member.github} target="_blank" rel="noopener noreferrer"
                                   style={styles.socialIcon}>
                                    <img src="https://img.icons8.com/ios-glyphs/30/000000/github.png" alt="GitHub"/>
                                </a>
                            )}
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                                   style={styles.socialIcon}>
                                    <img src="https://img.icons8.com/ios-filled/30/0077b5/linkedin.png" alt="LinkedIn"/>
                                </a>
                            )}
                            {member.twitter && (
                                <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                                   style={styles.socialIcon}>
                                    <img src="https://img.icons8.com/ios-filled/30/1da1f2/twitter.png" alt="Twitter"/>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getStyles = (theme) => ({
    page: {
        padding: '1.25rem',
        fontFamily: theme.typography.fontFamily,
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
    },
    text: {
        fontSize: '1rem',
        color: theme.palette.text.primary,
        marginBottom: '1.25rem',
    },
    mobileLink: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        border: '1px solid ' + theme.palette.colors.blue,
        padding: '0.25rem 0.5rem',
        borderRadius: '0.3125rem',
        transition: 'background-color 0.3s, color 0.3s',
    },
    teamContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(15.625rem, 1fr))',
        gap: '1.25rem',
        justifyContent: 'center',
    },
    card: {
        padding: '1.25rem',
        border: '1px solid #DDD',
        borderRadius: '0.5rem',
        boxShadow: '0 0.25rem 0.375re rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    memberName: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        marginBottom: '0.3125rem',
    },
    memberRole: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        marginBottom: '0.625rem',
    },
    socialLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.625rem',
    },
    socialIcon: {
        display: 'inline-block',
        transition: 'opacity 0.3s',
    },
});

export default TeamPage;
