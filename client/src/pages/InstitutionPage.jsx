import React from 'react';

const InstitutionPage = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.header}>L'établissement : IUT de Paris - Rives de Seine</h1>
            <p style={styles.text}>
                Situé en plein cœur de Paris, l'IUT de Paris - Rives de Seine est une composante de l'Université Paris Cité.
                Il offre une formation d'excellence dans des domaines variés tels que l'informatique, la gestion, le multimédia,
                et bien d'autres. L'établissement est reconnu pour ses valeurs d'innovation, de rigueur académique et d'ouverture
                vers le monde professionnel.
            </p>
            <p style={styles.text}>
                Avec ses partenariats solides et un corps enseignant passionné, l'IUT prépare ses étudiants à relever les défis
                du monde contemporain tout en encourageant la créativité et la collaboration.
            </p>

            <div style={styles.linksContainer}>
                <a
                    href="https://iutparis-seine.u-paris.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    Visiter le site officiel
                </a>
                <a
                    href="https://www.linkedin.com/school/iut-de-paris-rives-de-seine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                >
                    Page LinkedIn de l'IUT
                </a>
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
        marginBottom: '15px',
    },
    text: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '15px',
        lineHeight: '1.6',
    },
    linksContainer: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    link: {
        textDecoration: 'none',
        fontSize: '16px',
        color: '#0077b5',
        fontWeight: 'bold',
        transition: 'color 0.3s',
    },
    linkHover: {
        color: '#005580',
    },
};

export default InstitutionPage;
