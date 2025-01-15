// MobileCommentCard.jsx
import React, {useContext, useState} from "react";
import {styled, useTheme} from "@mui/material/styles";
import {
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {FaStar} from "react-icons/fa";
import {CommentsContext} from "./CommentsContext";

/* --------------------- Fonctions auxiliaires --------------------- */

/** Renvoie le label en fonction de la plateforme */
function getPlatformLabel(platform) {
    switch (platform?.toLowerCase()) {
        case "ps5":
        case "ps4":
        case "playstation":
            return "PlayStation";
        case "xbox":
            return "Xbox";
        case "nintendo switch":
        case "ns":
            return "Nintendo Switch";
        case "steam":
            return "Steam";
        case "gog":
            return "GOG";
        case "epic games store":
        case "egs":
            return "Epic Games Store";
        case "microsoft store":
        case "ms":
            return "Microsoft Store";
        default:
            return platform || "Inconnue";
    }
}

/** Renvoie la couleur associée à la plateforme */
function getPlatformColor(platform, theme) {
    switch (platform?.toLowerCase()) {
        case "ps5":
        case "ps4":
        case "playstation":
            return theme.palette.colors.purple;
        case "xbox":
            return theme.palette.colors.green;
        case "pc":
        case "steam":
            return theme.palette.colors.blue;
        case "nintendo switch":
        case "ns":
            return theme.palette.colors.red;
        case "gog":
            return theme.palette.colors.orange;
        case "epic games store":
        case "egs":
            return theme.palette.colors.teal;
        case "microsoft store":
        case "ms":
            return theme.palette.colors.lightBlue;
        default:
            return theme.palette.colors.grey;
    }
}


/* ------------------- Petit conteneur blanc (fond + ombre) ------------------- */
const WhiteBox = styled("div")(({theme}) => ({
    background: theme.palette.background.paper,
    boxShadow: "0px 0px 3px 1px rgba(0, 0, 0, 0.25)",
    borderRadius: 2,
    padding: "4px 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
}));

/* ------------------- Conteneurs et styles globaux ------------------- */
const CardContainer = styled("div")(({theme}) => ({
    width: "100%",
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
}));

const CommentCard = styled("div")(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
    overflow: "hidden", // empêche le texte de déborder
}));

const CoverImage = styled("img")(() => ({
    width: 140,  // Largeur fixe pour l'image
    height: "auto",
    objectFit: "cover",
    flexShrink: 0,
}));

const ContentContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    padding: 16,
    width: "100%",
}));

// Titre sur plusieurs lignes (jusqu'à 3)
const GameTitle = styled(Typography)(({theme}) => ({
    fontWeight: "bold",
    fontSize: "0.95rem",
    color: theme.palette.text.primary,
    margin: 0,
    whiteSpace: "normal",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
}));

const UserRow = styled("div")(() => ({
    marginBottom: 6,
}));

const PlatformStarsRow = styled("div")(() => ({
    display: "flex",
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
}));

const StarsContainer = styled("div")(() => ({
    display: "flex",
    gap: 2,
}));

const DescriptionText = styled(Typography)(() => ({
    fontSize: "0.85rem",
    lineHeight: 1.6,
    marginBottom: 8,
}));

const MoreButton = styled("button")(({theme}) => ({
    background: "none",
    border: "none",
    color: theme.palette.colors.blue,
    cursor: "pointer",
    fontSize: "0.8rem",
    textDecoration: "underline",
    textAlign: "left",
    padding: 0,
}));

const DeleteButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.colors.red,
    color: theme.palette.text.contrast,
    borderRadius: 20,
    fontSize: "0.8rem",
    fontWeight: "bold",
    textTransform: "none",
    "&:hover": {
        backgroundColor: theme.palette.colors["red-70"],
    },
}));

const BottomRow = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
}));

/* ------------------------- Composant principal ------------------------- */
export default function MobileCommentCard({
                                              comments = [],
                                              maxComments = null,
                                              currentUserId,
                                              onCommentDeleted,
                                          }) {
    const {deleteComment} = useContext(CommentsContext);
    const theme = useTheme();

    const displayedComments = maxComments
        ? comments.slice(0, maxComments)
        : comments;

    return (
        <CardContainer>
            {displayedComments.map((item, index) => {
                const [openDialog, setOpenDialog] = useState(false);

                const handleOpenDialog = () => setOpenDialog(true);
                const handleCloseDialog = () => setOpenDialog(false);

                // Tronque le texte si > 80 caractères
                const shortText =
                    item.content && item.content.length > 80
                        ? item.content.slice(0, 80) + "..."
                        : item.content;

                // Suppression
                const handleDelete = async () => {
                    try {
                        await deleteComment(item.id);
                        onCommentDeleted(item.id);
                        alert("Commentaire supprimé avec succès.");
                    } catch (err) {
                        console.error(err);
                        alert("Erreur de suppression.");
                    }
                };

                return (
                    <CommentCard key={item.id || index}>
                        {/* Image à gauche */}
                        <CoverImage
                            src={item.game?.cover || "https://via.placeholder.com/150"}
                            alt={item.game?.title || "Cover"}
                        />

                        {/* Contenu texte/info à droite */}
                        <ContentContainer>
                            {/* Titre */}
                            <WhiteBox style={{marginBottom: 8}}>
                                <GameTitle>{item.game?.title || "Nom du jeu inconnu"}</GameTitle>
                            </WhiteBox>

                            {/* Pseudo */}
                            <UserRow>
                                <WhiteBox>
                                    <Typography
                                        sx={{
                                            fontSize: "0.85rem",
                                            fontWeight: "bold",
                                            color: theme.palette.colors.green,
                                            margin: 0,
                                        }}
                                    >
                                        {item.user?.username || "User"}
                                    </Typography>
                                </WhiteBox>
                            </UserRow>

                            {/* Plateforme + Étoiles (uniquement si item.platform) */}
                            {item.platform && (
                                <PlatformStarsRow>
                                    {/* Plateforme avec le point coloré */}
                                    <WhiteBox
                                        sx={{
                                            "&::before": {
                                                content: '""',
                                                display: "inline-block",
                                                width: "15px",
                                                height: "15px",
                                                borderRadius: "50%",
                                                backgroundColor: getPlatformColor(item.platform, theme),
                                                flexShrink: 0,
                                                marginRight: "4px",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "0.75rem",
                                                fontWeight: "bold",
                                                color: theme.palette.text.primary,
                                                margin: 0,
                                            }}
                                        >
                                            {getPlatformLabel(item.platform)}
                                        </Typography>
                                    </WhiteBox>


                                    {/* Étoiles en jaune */}
                                    <WhiteBox>
                                        <StarsContainer>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    size={14}
                                                    color={
                                                        i < (item.rating || 0)
                                                            ? theme.palette.colors.yellow
                                                            : theme.palette.colors.grey
                                                    }
                                                />
                                            ))}
                                        </StarsContainer>
                                    </WhiteBox>
                                </PlatformStarsRow>
                            )}

                            {/* Description (tronquée) */}
                            <DescriptionText variant="body2">{shortText}</DescriptionText>

                            {/* Bas : Voir plus / Supprimer */}
                            <BottomRow>
                                {item.content && item.content.length > 80 && (
                                    <MoreButton onClick={handleOpenDialog}>Voir plus</MoreButton>
                                )}

                                {currentUserId === item.user_id && (
                                    <DeleteButton onClick={handleDelete}>Supprimer</DeleteButton>
                                )}
                            </BottomRow>
                        </ContentContainer>

                        {/* Popup "Voir plus" */}
                        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                            <DialogTitle>{item.game?.title || "Nom du jeu inconnu"}</DialogTitle>
                            <DialogContent dividers>
                                <DialogContentText
                                    sx={{whiteSpace: "pre-line", color: theme.palette.text.primary}}
                                >
                                    {item.content}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">
                                    Fermer
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </CommentCard>
                );
            })}
        </CardContainer>
    );
}
