import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from "@mui/material/Paper";

import {useTranslation} from 'react-i18next';
import {useTheme} from "@mui/material/styles";

function SignupBox({
  signupData,
  setSignupData,
  signupError,
  setShowSignup,
  handleSignupChange,
  handleSignupSubmit,
}) {

  const {t} = useTranslation();
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
      <form onSubmit={handleSignupSubmit}
      container
      spacing = {1} 
      direction="column"
      style = {{
        display: "flex",
        flexDirection:"column",}}
      >
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
          label={t("login.username")}
          value={signupData.username}
          onChange={handleSignupChange}
          required
        />
        <TextField style={{paddingTop:10, paddingBottom:5}}
          type="password"
          name="password"
          id="password-input"
          label={t("login.password")}
          value={signupData.password}
          onChange={handleSignupChange}
          autoComplete="new-password"
          required
      />
        <TextField style={{paddingBottom:15,}}
          type="password"
          id="confirmpasswrd-input"
          label={t("login.passwordConfirm")}
          autoComplete="new-password"
        />
        <TextField style={{paddingBottom:15,}}
          type="file"
          name="profilePicture"
          label={t("login.profilePicture")}
          accept="image/*"
          onChange={handleSignupChange}
        />
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
        <Button variant="contained" type = "submit" style={{
              width:'100%',
              backgroundColor: theme.palette.colors.purple,
              color: theme.palette.background.default,}} onClick={handleSignupSubmit}>

            {t("login.toSignup")}
        </Button>
        <p style={{paddingTop:10,paddingBottom:10,}}>{t("login.alreadyHaveAccount")}</p>
          <Button variant="contained" style={{
              width:'100%',
              backgroundColor: theme.palette.colors.yellow,
              color: theme.palette.background.default,}} onClick={() => setShowSignup(false)}>
              {t("login.toLogin")}
          </Button>
      </form>
    </Paper>
  )
}

export default SignupBox