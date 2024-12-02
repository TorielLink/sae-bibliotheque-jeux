import React from 'react';

const GameMedias = ({ videos, screenshots }) => {
    return (
        <div style={styles.container}>
            {/* Section des vidéos */}
            {videos && videos.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Vidéos</h2>
                    <div style={styles.mediaGrid}>
                        {videos.map((video) => (
                            <iframe
                                key={video.id}
                                src={`https://www.youtube.com/embed/${video.video_id}`}
                                title={video.name}
                                style={styles.video}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ))}
                    </div>
                </div>
            )}

            {/* Section des captures d'écran */}
            {screenshots && screenshots.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Galerie photos</h2>
                    <div style={styles.mediaGrid}>
                        {screenshots.map((screenshot) => (
                            <img
                                key={screenshot.id}
                                src={screenshot.url.replace('t_thumb', 't_screenshot_big')} // Remplacement pour une meilleure qualité
                                alt={`Capture d'écran du jeu`}
                                style={styles.screenshot}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Si aucun média n'est disponible */}
            {(!videos || videos.length === 0) && (!screenshots || screenshots.length === 0) && (
                <p style={styles.noMediaText}>Aucun média disponible pour ce jeu.</p>
            )}
        </div>
    );
};

// Styles inline pour la galerie
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    section: {
        marginBottom: '30px',
    },
    sectionTitle: {
        fontSize: '22px',
        marginBottom: '15px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '5px',
    },
    mediaGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px',
    },
    video: {
        width: '100%',
        height: '200px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    screenshot: {
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    noMediaText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
    },
};

export default GameMedias;
