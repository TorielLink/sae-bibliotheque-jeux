import React, { useState, useEffect } from 'react';
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";

/**TODO :
 *    - Changer le style (mieux correspondre à la maquette)
 *    - Gèrer le problème de jeux sans vidéo (=> plus rien ne fonctionne à cause de 'map')
 *    - Permettre de passer au média suivant/précédent avec des flèches droite/gauche visibles
 *     au survol du média principal
 */
const GameMedias = ({ videos, screenshots }) => {
    const [mainMediaIndex, setMainMediaIndex] = useState(0); // pour suivre le média principal sélectionné

    // Fusionner les vidéos et les captures d'écran dans une seule liste de miniatures
    const allMedia = [
        ...videos.map((video) => ({
            type: 'video',
            id: video.id,
            videoId: video.video_id,
            title: video.name,
            thumbnail: `https://img.youtube.com/vi/${video.video_id}/0.jpg`, // ajout de la vignette
        })),
        ...screenshots.map((screenshot) => ({
            type: 'image',
            id: screenshot.id,
            url: screenshot.url.replace('t_thumb', 't_screenshot_big'),
            title: 'Capture d\'écran',
        }))
    ];

    // Gestion du clic sur une miniature
    const handleThumbnailClick = (index) => {
        setMainMediaIndex(index);
    };

    // Gestion des flèches directionnelles pour changer le média principal
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            setMainMediaIndex((prevIndex) => (prevIndex + 1) % allMedia.length); // média suivant
        } else if (e.key === 'ArrowLeft') {
            setMainMediaIndex((prevIndex) =>
                (prevIndex - 1 + allMedia.length) % allMedia.length // média précédent
            );
        }
    };

    useEffect(() => {
        // Ajouter un écouteur d'événement clavier
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            // Nettoyer l'écouteur lors du démontage du composant
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [allMedia.length]);

    const mainMedia = allMedia[mainMediaIndex];

    return (
        <>
            <GameDetailsNavBar activeSection={"medias"} />
            <div style={styles.container}>
                {/* Afficher le média principal (le premier élément de la liste ou celui sélectionné) */}
                {mainMedia && mainMedia.type === 'video' ? (
                    <div style={styles.mainMedia}>
                        <iframe
                            key={mainMedia.id}
                            src={`https://www.youtube.com/embed/${mainMedia.videoId}?autoplay=0`} // La vidéo commence à jouer ici
                            title={mainMedia.title}
                            style={styles.videoMain}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div style={styles.mainMedia}>
                        <img
                            src={mainMedia.url}
                            alt={mainMedia.title}
                            style={styles.screenshotMain}
                        />
                    </div>
                )}

                {/* Miniatures des vidéos et captures d'écran */}
                <div style={styles.mediaGrid}>
                    {allMedia.map((media, index) => (
                        <div
                            key={media.id}
                            style={{
                                ...styles.mediaThumbnail,
                                ...(mainMedia?.id === media?.id ? styles.activeThumbnail : {}),
                            }}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <img
                                src={media.type === 'video' ? media.thumbnail : media.url}
                                alt={media.title}
                                style={styles.screenshotThumbnail}
                            />
                        </div>
                    ))}
                </div>

                {/* Si aucun média n'est disponible */}
                {allMedia.length === 0 && (
                    <p style={styles.noMediaText}>Aucun média disponible pour ce jeu.</p>
                )}
            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    section: {
        marginBottom: '30px',
    },
    mainMedia: {
        marginBottom: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '63%',
        height: '470px',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    mediaGrid: {
        width: "63%",
        display: 'flex',
        gap: '8px',
        padding: '0',
        justifyContent: 'flex-start',
        overflowX: 'auto',
    },
    mediaThumbnail: {
        flex: '0 0 auto',
        width: '135px',
        height: '77px',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
    },
    activeThumbnail: {
        border: '2px solid #0055FF',
    },
    videoMain: {
        width: '100%',
        height: '100%',
    },
    videoThumbnail: {
        width: '100%',
        height: '150px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    screenshotMain: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    screenshotThumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    noMediaText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
    },
};

export default GameMedias;
