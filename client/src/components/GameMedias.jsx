import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";

/**TODO :
 *     - Permettre de passer au média suivant/précédent avec des flèches droite/gauche visibles
 *     au survol du média principal
 *     - Gérer l'erreur "Uncaught TypeError: Cannot read properties of undefined (reading 'url')"
 */
const GameMedias = ({ videos, screenshots }) => {
    const [mainMediaIndex, setMainMediaIndex] = useState(0); // pour suivre le média principal sélectionné
    const mediaGridRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const styles = getStyles(theme, isMobile);

    // Fusionner les vidéos et les captures d'écran dans une seule liste de miniatures
    const allMedia = [
        ...videos?.map((video) => ({
            type: 'video',
            id: video.id,
            videoId: video.video_id,
            title: video.name,
            thumbnail: `https://img.youtube.com/vi/${video.video_id}/0.jpg`,
        })) || [],
        ...screenshots?.map((screenshot) => ({
            type: 'image',
            id: screenshot.id,
            url: screenshot.url?.replace('t_thumb', 't_screenshot_big'),
            title: 'Capture d\'écran',
        })) || [],
    ];

    // Gestion du clic sur une miniature
    const handleThumbnailClick = (index) => {
        setMainMediaIndex(index);
    };

    // Gestion du démarrage du glissement
    const handleMouseDown = (e) => {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.clientX;
        scrollLeft.current = mediaGridRef.current.scrollLeft;
    };

    // Gestion du mouvement de la souris pendant le glissement
    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const x = e.clientX;
        const walk = (x - startX.current) * 2; // multiplier pour ajuster la vitesse du glissement
        mediaGridRef.current.scrollLeft = scrollLeft.current - walk;
    };

    // Gestion de la fin du glissement
    const handleMouseUp = () => {
        isDragging.current = false;
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
        window.addEventListener('keydown', handleKeyDown);
        // Ajout d'événements de souris pour le glissement
        if (!allMedia.length || !mediaGridRef.current) return;
        const mediaGridElement = mediaGridRef.current;
        mediaGridElement.addEventListener('mousedown', handleMouseDown);
        mediaGridElement.addEventListener('mousemove', handleMouseMove);
        mediaGridElement.addEventListener('mouseup', handleMouseUp);
        mediaGridElement.addEventListener('mouseleave', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // Nettoyage des événements de la souris
            mediaGridElement.removeEventListener('mousedown', handleMouseDown);
            mediaGridElement.removeEventListener('mousemove', handleMouseMove);
            mediaGridElement.removeEventListener('mouseup', handleMouseUp);
            mediaGridElement.removeEventListener('mouseleave', handleMouseUp);
        };
    }, []);

    const mainMedia = allMedia[mainMediaIndex];

    return (
        <>
            { !isMobile && (
                <div style={styles.navContainer}> {/* Conteneur pour décaler la navbar */}
                    <GameDetailsNavBar activeSection={"medias"}/>
                </div>
            )}
            <div style={styles.container}>
                {/* Afficher tous les médias à la suite */}
                { isMobile ? (
                    <div style={styles.mobileMediaList}>
                        {allMedia.map((media) => (
                            <div key={media.id} style={styles.mobileMediaItem}>
                                {media.type === 'video' ? (
                                    <iframe
                                        key={media.id}
                                        src={`https://www.youtube.com/embed/${media.videoId}?autoplay=0`}
                                        title={media.title}
                                        style={styles.screenshotMain}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <img
                                        src={media.url}
                                        alt={media.title}
                                        style={styles.screenshotMain}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Afficher le média principal (le premier élément de la liste ou celui sélectionné) */}
                        {mainMedia && mainMedia.type === 'video' ? (
                            <div style={styles.mainMedia}>
                                <iframe
                                    key={mainMedia.id}
                                    src={`https://www.youtube.com/embed/${mainMedia.videoId}?autoplay=0`}
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

                        {/* Liste des miniatures des vidéos et captures d'écran */}
                        <div ref={mediaGridRef} style={styles.mediaGrid}>
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
                                        src={media.type === 'video' ? media.thumbnail : media.url || media.thumbnail}
                                        alt={media.title}
                                        style={styles.screenshotThumbnail}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Si aucun média n'est disponible */}
                {allMedia.length === 0 && (
                    <p style={styles.noMediaText}>Aucun média disponible pour ce jeu.</p>
                )}
            </div>
        </>
    );
};

const getStyles = (theme, isMobile) => ({
    navContainer: {
        marginLeft: '15%',
        marginBottom: '2%',
    },
    container: {
        padding: '20px',
        fontFamily: theme.typography.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? '10px' : '20px',
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
        paddingTop: 'calc(63% * 9 / 16)',
        height: '0',
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
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    videoThumbnail: {
        width: '100%',
        height: '150px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    screenshotMain: {
        position: 'absolute',
        top: 0,
        left: 0,
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
    mobileMediaList: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '15px',
    },
    mobileMediaItem: {
        width: '100%',
        aspectRatio: '16/9',
        position: 'relative',
    },
    noMediaText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
    },
});

export default GameMedias;
