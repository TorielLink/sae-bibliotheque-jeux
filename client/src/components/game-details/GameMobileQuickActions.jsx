import React, { useState } from "react";
import { Box, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCommentIcon from "@mui/icons-material/AddComment";
import StarIcon from "@mui/icons-material/Star";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

function GameMobileQuickActions() {
    // Gestion de l'état pour afficher ou masquer les actions rapides
    const [showActions, setShowActions] = useState(false);
    const theme = useTheme();

    return (
        <>
            {/* Bouton flottant pour afficher/masquer les actions rapides */}
            <Fab
                onClick={() => setShowActions((prev) => !prev)} // Bascule l'état
                sx={{
                    position: "fixed",
                    top: "65%", // Fixe le bouton à la moitié de la hauteur de l'écran
                    right: "16px",
                    zIndex: 1100,
                    transform: "translateY(-50%)",
                    backgroundColor: theme.palette.colors.blue,
                }}
            >
                {showActions ? <CloseIcon /> : <AddIcon />}
            </Fab>

            {/* Boutons d'action flottants supplémentaires, visibles lorsque showActions est vrai */}
            {showActions && (
                <>
                    <Fab
                        sx={{
                            position: "fixed",
                            top: "55%", // Ajustez la position pour qu'ils se superposent sous le bouton "+"
                            right: "16px",
                            zIndex: 1000,
                            transform: "translateY(-50%)",
                            backgroundColor: theme.palette.colors.red,
                        }}
                    >
                        <AddCommentIcon />
                    </Fab>

                    <Fab
                        color="secondary"
                        sx={{
                            position: "fixed",
                            top: "45%", // Placer encore plus bas
                            right: "16px",
                            zIndex: 1000,
                            transform: "translateY(-50%)",
                            backgroundColor: theme.palette.colors.red,
                        }}
                    >
                        <StarIcon />
                    </Fab>

                    <Fab
                        color="secondary"
                        sx={{
                            position: "fixed",
                            top: "35%", // Ajuster encore pour placer ce bouton
                            right: "16px",
                            zIndex: 1000,
                            transform: "translateY(-50%)",
                            backgroundColor: theme.palette.colors.red,
                        }}
                    >
                        <PlaylistAddIcon />
                    </Fab>
                </>
            )}
        </>
    );
}

export default GameMobileQuickActions;
