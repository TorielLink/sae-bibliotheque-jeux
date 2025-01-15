import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const InstitutionPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div>
                    <a href="/team" style={styles.mobileLink}>
                        Rencontrez les membres de l'équipe
                    </a>
                </div>
            )}

            <h1 style={styles.header}>L'établissement : IUT de Paris - Rives de Seine</h1>
            <p style={styles.text}>
                Situé à Paris, l'IUT de Paris - Rives de Seine est une composante de l'Université Paris Cité. Il offre
                une formation d'excellence dans des domaines variés tels que l'informatique, la gestion, le multimédia,
                et bien d'autres. L'établissement est reconnu pour ses valeurs d'innovation, de rigueur académique et
                d'ouverture vers le monde professionnel.
            </p>
            <p style={styles.text}>
                Avec ses partenariats solides et un corps enseignant passionné, l'IUT prépare ses étudiants à relever les défis
                du monde contemporain tout en encourageant la créativité et la collaboration.
            </p>

            <div style={styles.linksContainer}>
                <a
                    href="https://iutparis-seine.u-paris.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    Visiter le site officiel
                </a>
                <a
                    href="https://www.linkedin.com/school/iut-de-paris-rives-de-seine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    Page LinkedIn de l'IUT
                </a>
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
        lineHeight: '1.6',
    },
    linksContainer: {
        marginTop: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
    },
    link: {
        textDecoration: 'none',
        fontSize: '1rem',
        color: theme.palette.colors.blue,
        fontWeight: 'bold',
        transition: 'color 0.3s',
    },
    linkHover: {
        color: '#005580',
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
});

export default InstitutionPage;
