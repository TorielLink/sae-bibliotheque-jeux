import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProjectPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

const styles = {
    page: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
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
    list: {
        listStyleType: 'disc',
        paddingLeft: '20px',
        marginTop: '10px',
    },
    linksContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '10px',
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
        flexShrink: 0,
    },
};

export default ProjectPage;
