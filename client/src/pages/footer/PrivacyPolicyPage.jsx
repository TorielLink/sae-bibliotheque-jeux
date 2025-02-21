import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from 'react-i18next';

const PrivacyPolicy = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linkContainer}>
                    <a href="/terms" style={styles.mobileLink}>
                        {t("privacy.discoverTerms")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("footer.privacyPolicy")}</h1>
            {["intro", "data", "usage", "sharing", "security", "rights", "modifications"].map((section, index) => (
                <section key={index} style={styles.section}>
                    <h2 style={styles.subHeader}>{t(`privacy.${section}.title`)}</h2>
                    <p style={styles.text}>{t(`privacy.${section}.content`)}</p>

                    {["data", "usage", "sharing", "rights"].includes(section) && (
                        <ul style={styles.list}>
                            {(typeof t(`privacy.${section}.list`, { returnObjects: true }) === 'object')
                                ? Object.entries(t(`privacy.${section}.list`, { returnObjects: true })).map(([key, value], idx) => (
                                    <li key={idx}>{value}</li>
                                ))
                                : null}
                        </ul>
                    )}

                    {section === "rights" && (
                        <p style={styles.text}>
                            {t("privacy.rights.contact")}
                            <a href="mailto:privacy-scrib@example.com" style={styles.link}>
                                {t("privacy.rights.email")}
                            </a>
                        </p>
                    )}
                </section>
            ))}
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
    section: {
        marginBottom: '1.875rem',
    },
    subHeader: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
        paddingBottom: '0.3125rem',
    },
    list: {
        listStyleType: 'disc',
        paddingLeft: '1.25rem',
        marginTop: '0.625rem',
    },
    link: {
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        margin: '0.625rem 0',
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

export default PrivacyPolicy;
