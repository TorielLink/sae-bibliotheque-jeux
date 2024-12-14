import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {ThemeProvider } from '@mui/material';
import {greenBtn,blueBtn} from "./BtnColors.jsx";

function LoginBox({
  signupData,
  setSignupData,
  signupError,
  setShowSignup,
  handleSignupChange,
  handleSignupSubmit,
}) {
  return (
      <form 
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
          <TextField style={{paddingBottom:15,}}
            id="username-input"
            label="Username"
            type = "username"
            autoComplete="current-password"
          />
          <TextField style={{paddingBottom:15,}}
            id="password-input-1"
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
          />
          <ThemeProvider theme={greenBtn}>
            <Button variant="contained" color = "primary" style={{width:'100%'}}>Se Connecter</Button>
          </ThemeProvider>
          <p style={{paddingTop:10,paddingBottom:10,}}>Vous n'avez pas de compte?</p>
          <ThemeProvider theme={blueBtn}>
            <Button variant="contained" style={{width:'100%'}} onClick={() => setShowSignup(true)}>{"Créer un compte"}</Button>
          </ThemeProvider>
      </form>
  )
}

export default LoginBox