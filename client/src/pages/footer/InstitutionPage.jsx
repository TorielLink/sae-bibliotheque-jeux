import React from 'react';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from 'react-i18next';

const InstitutionPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div>
                    <a href="/team" style={styles.mobileLink}>
                        {t("institution.discoverTeam")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("institution.name")}</h1>
            <p style={styles.text}>
                {t("institution.description")}
            </p>
            <p style={styles.text}>
                {t("institution.plus")}
            </p>

            <div style={styles.linksContainer}>
                <a
                    href="https://iutparis-seine.u-paris.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    {t("institution.discoverSite")}
                </a>
                <a
                    href="https://www.linkedin.com/school/iut-de-paris-rives-de-seine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    {t("institution.discoverLinkedIn")}
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
