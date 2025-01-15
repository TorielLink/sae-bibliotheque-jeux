import React, {useContext, useState, useMemo} from "react";
import {FaStar} from "react-icons/fa";
import {Grid, Typography} from "@mui/material";
import CommentCard from "../components/CommentCard";
import {CommentsContext} from "../components/CommentsContext";

const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9",
};

function ReviewsPage() {
    const {comments} = useContext(CommentsContext);
    const [filterStars, setFilterStars] = useState(null);
    const [hoveredStars, setHoveredStars] = useState(null); // État pour gérer le survol
    const stars = Array(5).fill(0);

    const validComments = Array.isArray(comments) ? comments : [];

    const filteredComments = useMemo(() => {
        return filterStars !== null
            ? validComments.filter((comment) => comment.rating === filterStars)
            : validComments;
    }, [validComments, filterStars]);

    return (
        <div style={{padding: "20px"}}>
            <div style={styles.filterContainer}>
                {stars.map((_, index) => {
                    const isActive = filterStars === index + 1;
                    const isHovered = hoveredStars === index + 1;
                    return (
                        <button
                            key={index}
                            style={{
                                ...styles.filterButton,
                                ...(isActive || isHovered
                                    ? styles.filterButtonHover
                                    : {}),
                                backgroundColor: isActive
                                    ? colors.orange
                                    : isHovered
                                        ? colors.grey
                                        : "#f0f0f0",
                                color: isActive || isHovered ? "#fff" : "#000",
                            }}
                            onMouseEnter={() => setHoveredStars(index + 1)}
                            onMouseLeave={() => setHoveredStars(null)}
                            onClick={() => setFilterStars(index + 1)}
                        >
                            {index + 1}{" "}
                            <FaStar
                                color={
                                    isActive || isHovered ? "#fff" : colors.orange
                                }
                            />
                        </button>
                    );
                })}
                <button
                    style={{
                        ...styles.filterButton,
                        ...(filterStars === null || hoveredStars === null
                            ? styles.filterButtonHover
                            : {}),
                        backgroundColor:
                            filterStars === null
                                ? colors.orange
                                : hoveredStars === null
                                    ? colors.grey
                                    : "#f0f0f0",
                        color:
                            filterStars === null || hoveredStars === null
                                ? "#fff"
                                : "#000",
                    }}
                    onMouseEnter={() => setHoveredStars(null)}
                    onMouseLeave={() => setHoveredStars(null)}
                    onClick={() => setFilterStars(null)}
                >
                    Tous
                </button>
            </div>
            {filteredComments.length === 0 ? (
                <p style={styles.noResultsText}>
                    Aucun commentaire ne correspond à ce filtre.
                </p>
            ) : (
                <Grid container spacing={2}>
                    {filteredComments.map((comment) => (
                        <Grid
                            item
                            xs={12}
                            sm={6} // 2 avis par ligne sur écrans moyens et plus
                            key={comment.id}
                        >
                            <Typography variant="h6" style={styles.commentAuthor}>
                                {comment.author}
                            </Typography>
                            <Typography variant="body1" style={styles.commentContent}>
                                {comment.content}
                            </Typography>
                            <CommentCard comments={[comment]}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}

const styles = {
    filterContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "20px",
        maxWidth: "100%",
        padding: "0 10px",
        gap: "10px",
    },
    filterButton: {
        margin: "0 10px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        transition: "background-color 0.3s, color 0.3s, transform 0.2s",
        backgroundColor: "#f0f0f0",
        color: "#000",
    },
    filterButtonHover: {
        transform: "scale(1.05)",
    },
    noResultsText: {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "16px",
        color: "#666",
    },
    commentAuthor: {
        fontWeight: "bold",
        marginBottom: "5px",
    },
    commentContent: {
        marginBottom: "5px",
    },
};

export default ReviewsPage;
