import React from "react";
import "../css/Footer.css";
import { useTheme } from '@mui/material/styles';

function Footer(){
    const footerStyle = useTheme();

    return (
        <section style={{
            backgroundColor : footerStyle.palette.background.footer,
            color: footerStyle.palette.text.primary,
        }}>
            <div className="footer">
                <div className="footer-left">
                <h3>À propos de nous</h3>
                <p>L'équipe</p>
                <p>L'établissement</p>
                </div>

                <div className="footer-left-middle">
                    <h3>À propos du projet</h3>
                    <p>Le projet</p>
                    <p>L'encadrement</p>
                    <p>Dépôt GitHub</p>
                </div>

                <div className="footer-right-middle">
                    <h3>Confidentialité</h3>
                    <p>Termes & conditions</p>
                    <p> Politique & confidentialité</p>
                </div>

                <div className="footer-right">
                    <h3>Contact</h3>
                    <p>GitHub</p>
                    <p>Adresse mail</p>
                    <p>Discord</p>
                </div>
            </div>
            
            <hr className="footer-line"/>

            <div className="footer-bottom">
                <p>Tous droits réservés © 2024</p>
            </div>

        </section>
    )
}
export default Footer;