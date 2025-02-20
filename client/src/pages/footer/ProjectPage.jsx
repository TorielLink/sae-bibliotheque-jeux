import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from "react-i18next";

const ProjectPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linksContainer}>
                    <a href="/mentorship" style={styles.mobileLink}>
                        {t("project.discoverMana")}
                    </a>
                    <a href="https://github.com/TorielLink/BibliothequeJeuxIUT" target="_blank"
                       rel="noopener noreferrer" style={styles.mobileLink}>
                        {t("project.discoverGitHub")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("footer.project")}</h1>
            <p style={styles.text}>
                {t("project.description")}
            </p>

            {/* Section : Objectif */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #2FC75A'}}>{t("project.goal.title")}</h2>
                <p style={styles.text}>
                    {t("project.goal.description")}
                </p>
            </div>

            {/* Section : Fonctionnalités principales */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #9534D5'}}>{t("project.mainFeatures.title")}</h2>
                <ul style={styles.list}>
                    <li>{t("project.mainFeatures.list.IGDB")}</li>
                    <li>{t("project.mainFeatures.list.library")}</li>
                    <li>{t("project.mainFeatures.list.gameLogs")}</li>
                    <li>{t("project.mainFeatures.list.collections")}</li>
                </ul>
            </div>

            {/* Section : Fonctionnalités avancées */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #36A0FC'}}>{t("project.advancedFeatures.title")}</h2>
                <p style={styles.text}>
                    {t("project.advancedFeatures.description")}
                </p>
            </div>

            {/* Section : Vision */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #FE4A49'}}>{t("project.view.title")}</h2>
                <p style={styles.text}>
                    {t("project.view.description")}
                </p>
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
    linksContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '0.625rem',
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
        flexShrink: 0,
    },
});

export default ProjectPage;
