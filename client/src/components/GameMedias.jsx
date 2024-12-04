import React, { useState } from 'react';
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";

const GameMedias = ({ videos, screenshots }) => {
    const [mainMedia, setMainMedia] = useState(null); // pour suivre le média principal sélectionné

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

    // Si aucun média principal n'est sélectionné, utiliser le premier élément de la liste
    const initialMainMedia = mainMedia || allMedia[0];

    const handleMediaClick = (media) => {
        setMainMedia(media);
    };

    return (
        <>
            <GameDetailsNavBar />
            <div style={styles.container}>
                {/* Afficher le média principal (le premier élément de la liste ou celui sélectionné) */}
                {initialMainMedia && initialMainMedia.type === 'video' ? (
                    <div style={styles.mainMedia}>
                        <iframe
                            key={initialMainMedia.id}
                            src={`https://www.youtube.com/embed/${initialMainMedia.videoId}?autoplay=0`} // La vidéo commence à jouer ici
                            title={initialMainMedia.title}
                            style={styles.videoMain}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div style={styles.mainMedia}>
                        <img
                            src={initialMainMedia.url}
                            alt={initialMainMedia.title}
                            style={styles.screenshotMain}
                        />
                    </div>
                )}

                {/* Miniatures des vidéos et captures d'écran */}
                <div style={styles.mediaGrid}>
                    {allMedia.map((media) => (
                        <div
                            key={media.id}
                            style={{
                                ...styles.mediaThumbnail,
                                ...(mainMedia?.id === media?.id ? styles.activeThumbnail : {}),
                            }}
                            onClick={() => setMainMedia(media)}
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
        width: '70%',
        height: '360px',
        borderRadius: '10px',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    mediaGrid: {
        display: 'flex',
        gap: '8px',
        padding: '0',
        justifyContent: 'center',
        overflowX: 'auto',
    },
    mediaThumbnail: {
        flex: '0 0 auto',
        width: '90px',
        height: '50px',
        cursor: 'pointer',
        borderRadius: '5px',
        overflow: 'hidden',
        position: 'relative',
    },
    activeThumbnail: {
        border: '2px solid #007BFF',
        borderRadius: '5px',
    },
    videoMain: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
    },
    videoThumbnail: {
        width: '100%',
        height: '150px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    screenshotMain: {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
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
