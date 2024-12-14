import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {ThemeProvider } from '@mui/material';
import {purpleBtn,yellowBtn} from "./BtnColors.jsx";

function SignupBox({
  signupData,
  setSignupData,
  signupError,
  setShowSignup,
  handleSignupChange,
  handleSignupSubmit,
}) {
  return (
    <form onSubmit={handleSignupSubmit}
    container
    spacing = {1}
    direction="column"
    style={{
    fontFamily: 'Inter, Arial, sans-serif',
    position: 'absolute', left: '50%', top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#E6E6E6',
    borderRadius: '10px',
    display: "flex",
    flexDirection:"column",
    paddingTop:40,paddingBottom:40,paddingLeft:80,paddingRight:80,
    textAlign:"center",
    }}>
      <TextField style={{paddingTop:10,paddingBottom:10,offset:0}}
        type="email"
        name="mail"
        id="email-input"
        label="E-mail"
        value={signupData.mail}
        onChange={handleSignupChange}
        autoComplete="email"
        required
      />
      <TextField style={{paddingTop:10,paddingBottom:10,offset:0}}
        type="text"
        name="username"
        id="username-input"
        label="Username"
        value={signupData.username}
        onChange={handleSignupChange}
        required
      />
      <TextField style={{paddingTop:10, paddingBottom:5}}
        type="password"
        name="password"
        id="password-input"
        label="Mot de passe"
        value={signupData.password}
        onChange={handleSignupChange}
        autoComplete="new-password"
        required
    />
      <TextField style={{paddingBottom:15,}}
        type="password"
        id="confirmpasswrd-input"
        label="Confirmer Mot de passe"
        autoComplete="new-password"
      />
      <TextField style={{paddingBottom:15,}}
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleSignupChange}
      />
      {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
      <ThemeProvider theme={purpleBtn}>
        <Button variant="contained" color = "primary" type = "submit" style={{width:'100%'}} onClick={handleSignupSubmit}>S'inscrire</Button>
      </ThemeProvider>
      <p style={{paddingTop:10,paddingBottom:10,}}>Déja inscrit?</p>
      <ThemeProvider theme={yellowBtn} >
        <Button variant="contained"   style={{width:'100%'}} onClick={() => setShowSignup(false)}>{"Se connecter"}</Button>
      </ThemeProvider>
    </form>
  )
}

export default SignupBox