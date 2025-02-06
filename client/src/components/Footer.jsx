import React from "react";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Footer = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <footer style={styles.footerContainer}>
            {!isMobile && (
                <div style={styles.footerContent}>
                    {/* Section : À propos de nous */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>{t("footer.aboutUs")}</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/team" style={styles.link}>{t("footer.team")}</a></li>
                            <li><a href="/institution" style={styles.link}>{t("footer.institution")}</a></li>
                        </ul>
                    </div>

                    {/* Section : À propos du projet */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>{t("footer.aboutProject")}</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/project" style={styles.link}>{t("footer.project")}</a></li>
                            <li><a href="/mentorship" style={styles.link}>{t("footer.mentorship")}</a></li>
                            <li><a href="https://github.com/TorielLink/BibliothequeJeuxIUT" target="_blank"
                                   rel="noopener noreferrer" style={styles.link}>{t("footer.githubRepo")}</a></li>
                        </ul>
                    </div>

                    {/* Section : Confidentialité */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>{t("footer.privacy")}</h3>
                        <ul style={styles.linkList}>
                            <li><a href="/terms" style={styles.link}>{t("footer.termsConditions")}</a></li>
                            <li><a href="/privacy-policy" style={styles.link}>{t("footer.privacyPolicy")}</a></li>
                        </ul>
                    </div>

                    {/* Section : Contact */}
                    <div style={styles.column}>
                        <h3 style={styles.header}>{t("footer.contact")}</h3>
                        <ul style={styles.linkList}>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer"
                                   style={styles.link}>GitHub</a></li>
                            <li><a href="mailto:contact-srcib@example.com" style={styles.link}>
                                {t("footer.email")}</a></li>
                            <li><a href="/discord" style={styles.link}>Discord</a></li>
                        </ul>
                    </div>
                </div>
                )}

            {isMobile && (
                <div style={styles.mobileFooterContent}>
                    {/* Section : Nous */}
                    <div style={styles.column}>
                        <a href="/team" style={styles.link}>{t("footer.teamShort")}</a>
                    </div>

                    {/* Section : Projet */}
                    <div style={styles.column}>
                        <a href="/project" style={styles.link}>{t("footer.projectShort")}</a>
                    </div>

                    {/* Section : Confidentialité */}
                    <div style={styles.column}>
                        <a href="/privacy-policy" style={styles.link}>{t("footer.privacy")}</a>
                    </div>

                    {/* Section : Contact */}
                    <div style={styles.column}>
                        <a href="/contact" style={styles.link}>{t("footer.contact")}</a>
                    </div>
                </div>
            )}

            <hr style={styles.separator}/>

            {/* Bas de page */}
            <div style={styles.footerBottom}>
                <p style={styles.bottomText}>{t("footer.copyRight")}</p>
            </div>
        </footer>
    );
};

const getStyles = (theme) => ({
    footerContainer: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text,
        padding: '40px 20px',
        marginTop: '20px',
        fontFamily: theme.typography.fontFamily,
    },
    footerContent: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        gap: '60px',
        paddingInline: '12%',
    },
    mobileFooterContent: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0 5%',
        textAlign: 'center',
    },
    column: {
        flex: '1',
        textAlign: 'center',
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    linkList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
        fontSize: '14px',
        lineHeight: '1.8',
        transition: 'color 0.3s',
        cursor: 'pointer',
    },
    linkHover: {
        color: theme.palette.text.secondary,
    },
    separator: {
        border: 'none',
        borderTop: '1px solid ' + theme.palette.text.secondary,
        margin: '20px auto',
        width: '90%',
    },
    footerBottom: {
        textAlign: 'center',
    },
    bottomText: {
        fontSize: '14px',
        fontWeight: 'medium',
        color: theme.palette.text.secondary,
    },
});

export default Footer;