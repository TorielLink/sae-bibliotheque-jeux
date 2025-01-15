import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";

import {useTheme} from "@mui/material/styles";

function LoginBox({
  signupData,
  setSignupData,
  signupError,
  setShowSignup,
  handleSignupChange,
  handleSignupSubmit,
  handleLoginChange,
  handleLoginSubmit,
  credentials,
}) {
  
  const theme = useTheme();
  
  return (
    <Paper elevation={3} style={{
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'absolute', left: '50%', top: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '10px',
      paddingTop:40,paddingBottom:40,paddingLeft:80,paddingRight:80,
      textAlign:"center",
      }}>
      <form onSubmit={handleLoginSubmit}
      container
      spacing = {1} 
      direction="column"
      style = {{
        display: "flex",
        flexDirection:"column",}}
      >
          <TextField style={{paddingBottom:15,}}
            id="username-input"
            label="Username"
            autoComplete="current-password"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleLoginChange}
            required
          />
          <TextField style={{paddingBottom:15,}}
            id="password-input-1"
            label="Mot de passe"
            autoComplete="current-password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleLoginChange}
            required
          />
          <Button variant="contained" type="submit" style={{
            width:'100%',
            backgroundColor: theme.palette.colors.green,
            color: theme.palette.background.default,}}>
              Se Connecter
          </Button>
          <p style={{paddingTop:10,paddingBottom:10,}}>Vous n'avez pas de compte?</p>
            <Button variant="contained" style={{
            width:'100%',
            backgroundColor: theme.palette.colors.blue,
            color: theme.palette.background.default,}} onClick={() => setShowSignup(true)}>
              Créer un compte
            </Button>
      </form>
    </Paper>
  )
}

export default LoginBox