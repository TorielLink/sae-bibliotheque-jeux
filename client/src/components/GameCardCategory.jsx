import React from 'react';
import StarIcon from "@mui/icons-material/Star";

import { useTheme } from '@mui/material/styles';


const JeuPopulaire = ({ image, title, note, tags }) => {
    const theme = useTheme();
    const styles = getStyles(theme); // import style

  return (
    <section className="gameCard">
      <img src={image} alt={title}  style={styles.poster} />
      <h3 style={styles.title} >{title}</h3>
      <div className="notes">
        <p>Note: {note} </p> 
        <StarIcon style={styles.star}/>
      </div>
      <div className="tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag" style ={styles.tags}>{tag} </span>
        ))}
      </div>
      <button>Découvrir</button>
    </section>
  );
};

const getStyles = (theme) => ({
    poster: {
        width: "9.375em", //13em
        height: "14.063em", //20em
        borderRadius: "0.3125em",
        boxShadow: "0 0 0.5em #000000",
        overflow: "hidden",
        cursor: "pointer",
    },
    title :{
        fontSize: "20px",
        fontWeight:"500",
        fontFamily : theme.typography.fontFamily,
        color : theme.palette.text.primary,
    },
    star : {
        height : "1em",
        weight : "1em",
        color : theme.palette.colors.yellow,
    },
    note : {
        fontSize: "15px",
        fontFamily : theme.typography.fontFamily,
        color : theme.palette.text.primary,
    },
    tags : {
        fontSize: "15px",
        fontFamily : theme.typography.fontFamily,
        color : theme.palette.text.contrast,
        backgroundColor: theme.palette.colors.red,
        padding : "0.438em",
        borderRadius: "0.3125em",
    }          
})

export default JeuPopulaire;