import React from 'react';
import {useTheme} from "@mui/material/styles";
import {useTranslation} from 'react-i18next';

const ContactPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const styles = getStyles(theme);
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>{t("contact.contactUs")}</h1>
            <p style={styles.text}>
                {t("contact.contactUsPlatforms")}
            </p>

            <ul style={styles.linkList}>
                <li>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                    >
                        GitHub
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:contact-scrib@example.com"
                        style={styles.link}
                    >
                        {t("footer.email")}
                    </a>
                </li>
                <li>
                    <a
                        href="/discord"
                        style={styles.link}
                    >
                        Discord
                    </a>
                </li>
            </ul>
        </div>
    );
};

const getStyles = (theme) => ({
    page: {
        padding: '1.25rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        lineHeight: '1.6',
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.25rem',
    },
    text: {
        fontSize: '1rem',
        marginBottom: '0.9375rem',
    },
    linkList: {
        listStyleType: 'none',
        padding: '0',
    },
    link: {
        display: 'block',
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        margin: '0.625rem 0',
        transition: 'color 0.3s',
    },
});

export default ContactPage;
