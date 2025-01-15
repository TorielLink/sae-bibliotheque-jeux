// PCCommentCard.jsx
import React, {useState, useContext, useRef, useEffect} from "react";
import {styled, useTheme} from "@mui/material/styles";
import {FaStar} from "react-icons/fa";
import {Button, Typography} from "@mui/material";
import {CommentsContext} from "./CommentsContext";

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
            return theme.palette.colors.purple; // PlayStation - Violet
        case "xbox":
            return theme.palette.colors.green;  // Xbox - Vert
        case "pc":
        case "steam":
            return theme.palette.colors.blue;   // PC (Steam) - Bleu
        case "nintendo switch":
        case "ns":
            return theme.palette.colors.red;    // Nintendo Switch - Rouge
        case "gog":
            return theme.palette.colors.orange; // GOG - Orange
        case "epic games store":
        case "egs":
            return theme.palette.colors.teal;   // Epic Games Store - Bleu-vert
        case "microsoft store":
        case "ms":
            return theme.palette.colors.lightBlue; // Microsoft Store - Bleu clair
        default:
            return theme.palette.colors.grey;   // Autres - Gris
    }
}


const Root = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const CommentsContainer = styled("div")(({theme}) => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1600px",
    padding: "10px",
    boxSizing: "border-box",
}));

const CommentBlock = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    border: `1px solid ${theme.palette.colors.lightGray}`,
    borderRadius: 5,
    padding: 0,
    marginBottom: 20,
    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        width: "90%",
        margin: "0 auto",
    },
}));

const CoverImage = styled("img")(({theme}) => ({
    width: "50%",
    height: "auto",
    objectFit: "cover",
    margin: 0,
    flexShrink: 0,
    maxWidth: "200px",
    minWidth: "100px",
    [theme.breakpoints.down("md")]: {
        width: "100%",
        maxWidth: "300px",
        display: "block",
    },
}));

const CommentContent = styled("div")(({theme}) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "15px",
}));

const TopContainer = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
}));

const GameNameContainer = styled("div")(({theme}) => ({
    marginBottom: "5px",
    padding: "0px 10px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "0.7em",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
}));

const UserContainer = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    height: "35px",
    width: "80px",
    fontSize: "0.9em",
    color: theme.palette.text.primary,
    fontWeight: "bold",
}));

const PlatformStarsContainer = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    marginTop: "20px",
    marginLeft: "auto",
}));

const PlatformContainer = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    gap: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    height: "35px",
    width: "auto",
}));

const StarsContainer = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    width: "100px",
    height: "35px",
}));

const DateText = styled("p")(({theme}) => ({
    fontSize: "0.8em",
    color: theme.palette.text.secondary,
    marginTop: "auto",
}));

const DeleteButton = styled(Button)(({theme}) => ({
    alignSelf: "flex-end",
    backgroundColor: theme.palette.colors.red,
    color: theme.palette.text.contrast,
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    marginTop: "10px",
    textTransform: "none",
    "&:hover": {
        backgroundColor: theme.palette.colors["red-70"],
        transform: "scale(1.05)",
    },
}));

const ViewMoreButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.colors.yellow,
    color: theme.palette.text.primary,
    borderRadius: "25px",
    border: "none",
    padding: "5px 10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    marginTop: "5px",
    textTransform: "none",
    "&:hover": {
        backgroundColor: theme.palette.colors["yellow-70"],
        transform: "scale(1.05)",
    },
}));

export default function PCCommentCard({comments = [], maxComments = null, currentUserId, onCommentDeleted,}) {
    const {deleteComment} = useContext(CommentsContext);
    const theme = useTheme();
    const [modalText, setModalText] = useState(null);

    const displayedComments = maxComments
        ? comments.slice(0, maxComments)
        : comments;

    return (
        <Root>
            {modalText && (
                <FullTextModal text={modalText} onClose={() => setModalText(null)}/>
            )}

            <CommentsContainer>
                {displayedComments.map((item, index) => (
                    <CommentBlock key={item.id || index}>
                        <CoverImage
                            src={item.game?.cover || "https://via.placeholder.com/150"}
                            alt={item.game?.title || "Cover image"}
                        />

                        <CommentContent>
                            <TopContainer>
                                <GameNameContainer>
                                    <p>{item.game?.title || "Nom du jeu inconnu"}</p>
                                </GameNameContainer>

                                <PlatformStarsContainer>
                                    <UserContainer>
                                        <p>{item.user?.username || "Utilisateur inconnu"}</p>
                                    </UserContainer>

                                    {item.platform && (
                                        <PlatformContainer
                                            sx={{
                                                "&::before": {
                                                    content: '""',
                                                    display: "inline-block",
                                                    width: 15,
                                                    height: 15,
                                                    borderRadius: "50%",
                                                    backgroundColor: getPlatformColor(item.platform, theme),
                                                    marginRight: 3,
                                                },
                                            }}
                                        >
                                            <p style={{margin: 0}}>{getPlatformLabel(item.platform)}</p>
                                        </PlatformContainer>
                                    )}

                                    <StarsContainer>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                size={20}
                                                color={
                                                    i < (item.rating || 0)
                                                        ? theme.palette.colors.yellow
                                                        : theme.palette.colors.grey
                                                }
                                            />
                                        ))}
                                    </StarsContainer>
                                </PlatformStarsContainer>
                            </TopContainer>

                            <CommentText
                                text={item.content}
                                onViewMore={() => setModalText(item.content)}
                            />

                            <DateText>{item.date_published || "Date inconnue"}</DateText>

                            {currentUserId === item.user_id && (
                                <DeleteButton
                                    onClick={async () => {
                                        try {
                                            await deleteComment(item.id);
                                            onCommentDeleted(item.id);
                                            alert("Commentaire supprimé avec succès.");
                                        } catch (error) {
                                            console.error(error);
                                            alert("Erreur lors de la suppression.");
                                        }
                                    }}
                                >
                                    Supprimer
                                </DeleteButton>
                            )}
                        </CommentContent>
                    </CommentBlock>
                ))}
            </CommentsContainer>
        </Root>
    );
}

/* ----------------------- Sous-composants ----------------------- */
function CommentText({text, onViewMore}) {
    const textRef = useRef(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            const isTextOverflowing =
                textRef.current.scrollHeight > textRef.current.offsetHeight;
            setIsOverflow(isTextOverflowing);
        }
    }, [text]);

    return (
        <div>
            <Typography
                ref={textRef}
                sx={{
                    margin: 0,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {text}
            </Typography>
            {isOverflow && (
                <ViewMoreButton onClick={() => onViewMore()}>
                    Voir plus →
                </ViewMoreButton>
            )}
        </div>
    );
}

function FullTextModal({text, onClose}) {
    const theme = useTheme();
    const ModalOverlay = styled("div")(() => ({
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    }));

    const ModalContent = styled("div")(() => ({
        backgroundColor: theme.palette.background.paper,
        padding: "40px",
        borderRadius: "15px",
        maxWidth: "900px",
        width: "90%",
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    }));

    const CloseButton = styled("button")(() => ({
        backgroundColor: theme.palette.colors.red,
        color: theme.palette.text.contrast,
        padding: "12px 24px",
        border: "none",
        borderRadius: "20px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)",
        width: "150px",
        textAlign: "center",
        "&:hover": {
            backgroundColor: theme.palette.colors["red-70"],
            transform: "scale(1.05)",
        },
    }));

    return (
        <ModalOverlay>
            <ModalContent>
                <Typography sx={{fontSize: "1.2rem", lineHeight: "1.8"}}>
                    {text}
                </Typography>
                <CloseButton onClick={onClose}>Fermer</CloseButton>
            </ModalContent>
        </ModalOverlay>
    );
}