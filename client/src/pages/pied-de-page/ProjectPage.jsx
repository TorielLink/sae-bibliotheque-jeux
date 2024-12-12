import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProjectPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linksContainer}>
                    <a href="/mentorship" style={styles.mobileLink}>
                        Découvrir l'encadrement
                    </a>
                    <a href="https://github.com/TorielLink/BibliothequeJeuxIUT" target="_blank"
                       rel="noopener noreferrer" style={styles.mobileLink}>
                        Voir le dépôt GitHub
                    </a>
                </div>
            )}

            <h1 style={styles.header}>Le projet</h1>
            <p style={styles.text}>
                Découvrez notre vision et les fonctionnalités ambitieuses que nous avons prévues pour cette application
                de gestion de bibliothèques de jeux vidéo.
            </p>

            {/* Section : Objectif */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #2FC75A'}}>Objectif</h2>
                <p style={styles.text}>
                    Créer une plateforme innovante qui permet aux joueurs de suivre, gérer et partager leur bibliothèque
                    de jeux vidéo, inspirée par des plateformes comme <i>Letterboxd</i> et <i>MyDramaList</i> mais
                    adaptée aux jeux.
                </p>
            </div>

            {/* Section : Fonctionnalités principales */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #9534D5'}}>Fonctionnalités principales</h2>
                <ul style={styles.list}>
                    <li>Récupération des données de jeux via l'API d’IGDB.</li>
                    <li>Ajout de jeux à une bibliothèque personnelle, avec gestion des statuts (joué, complété,
                        abandonné, etc.).</li>
                    <li>Journalisation des sessions de jeu : plateformes, temps de jeu, notes, avis, etc.</li>
                    <li>Création de listes thématiques et partage avec d'autres utilisateurs.</li>
                </ul>
            </div>

            {/* Section : Fonctionnalités avancées */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #36A0FC'}}>Fonctionnalités avancées</h2>
                <p style={styles.text}>
                    Nous envisageons d’intégrer les bibliothèques Steam, PSN et Xbox directement via leurs APIs, rendant
                    l’expérience encore plus fluide et centralisée.
                </p>
            </div>

            {/* Section : Vision */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid #FE4A49'}}>Vision</h2>
                <p style={styles.text}>
                    Notre objectif est de créer une communauté de passionnés, où chaque joueur peut partager ses
                    expériences, découvrir de nouveaux jeux et organiser son temps de jeu de manière efficace et ludique.
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
