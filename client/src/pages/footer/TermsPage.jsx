import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from 'react-i18next';

const Terms = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linkContainer}>
                    <a href="/privacy-policy" style={styles.mobileLink}>
                        {t("terms.discoverPrivacy")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("footer.termsConditions")}</h1>

            {["intro", "usage", "intellectualProperty", "liability", "modifications"].map((section, index) => (
                <section key={index} style={styles.section}>
                    <h2 style={styles.subHeader}>{t(`terms.${section}.title`)}</h2>
                    <p style={styles.text}>{t(`terms.${section}.content`)}</p>
                </section>
            ))}

            <section style={styles.section}>
                <h2 style={styles.subHeader}>{t("terms.contact.title")}</h2>
                <p style={styles.text}>
                    {t("terms.contact.content")}
                    <a href="mailto:contact-scrib@example.com" style={styles.link}>
                        {t("terms.contact.email")}
                    </a>
                </p>
            </section>
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

export default Terms;
