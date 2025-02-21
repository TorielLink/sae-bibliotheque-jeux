// src/pages/SettingsPage.jsx
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext';
import {Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Button, Card, CardContent, Divider, Snackbar,
    Stack, TextField, Typography, useTheme} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import {useDropzone} from 'react-dropzone';
import {useTranslation} from "react-i18next";

const API_URL = '/users';

const SettingsPage = () => {
    const {user, token, setUser, logout} = useContext(AuthContext);
    const userId = user?.id;
    const {t} = useTranslation();
    // États pseudo
    const [newPseudo, setNewPseudo] = useState(user?.username || '');
    const [pseudoMessage, setPseudoMessage] = useState('');

    // États photo de profil
    const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [profileMessage, setProfileMessage] = useState('');

    // États mot de passe
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const isPasswordValid =
        oldPassword.trim() !== '' &&
        newPassword.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        newPassword === confirmPassword;

    const theme = useTheme();

    useEffect(() => {
        console.log('Token:', token);
        console.log('User ID:', userId);
    }, [token, userId]);

    // État pour gérer le Snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // État pour contrôler quel accordéon est ouvert
    const [expandedAccordion, setExpandedAccordion] = useState(false);

    // Fonction pour fermer le Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({...snackbar, open: false});
    };

    // Fonction pour gérer l'ouverture/fermeture des accordéons
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    // Fonction de mise à jour de l'utilisateur
const updateUser = async (updates, isFormData = false) => {
  if (isFormData) {
    return fetch(`${API_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: updates // c'est ton FormData intact
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw data;
      // Mise à jour du context utilisateur
      setUser((prev) => ({
        ...prev,
        ...data.data,
        id: prev.id
      }));
      return data;
    }).catch((err) => {
      console.error("Erreur upload FormData:", err);
      return null;
    });
  }

  // 2) Sinon, c'est un simple objet JSON
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([_, v]) => v !== undefined)
  );

  return fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(sanitizedUpdates)
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw data;
    // Mise à jour du context utilisateur
    setUser((prev) => ({
      ...prev,
      ...data.data,
      id: prev.id
    }));
    return data;
  }).catch((err) => {
    console.error("Erreur upload JSON:", err);
    return null;
  });
};


    const handleUpdatePseudo = async () => {
        if (newPseudo !== user?.username && newPseudo.trim() !== '') {
            const result = await updateUser({username: newPseudo});
            if (result) {
                setSnackbar({
                    open: true,
                    message: t("settingsPage.majSpeudo"),
                    severity: 'success',
                });
                setExpandedAccordion(false);
            } else {
                setSnackbar({
                    open: true,
                    message: t("settingsPage.errorMaj"),
                    severity: 'error',
                });
            }
        } else {
            setSnackbar({
                open: true,
                message: t("settingsPage.noModifFind"),
                severity: 'info',
            });
        }
    };

    // Fonction de mise à jour de la photo de profil
    const handleUpdateProfilePicture = async () => {
        if (!profilePictureFile) {
            setSnackbar({
                open: true,
                message: t("settingsPage.noPicturesSelect"),
                severity: 'info',
            });
            return;
        }

        const formData = new FormData();
        formData.append('profile_picture', profilePictureFile);

        const result = await updateUser(formData, true);
        if (result) {
            setSnackbar({
                open: true,
                message: t("settingsPage.majPicture"),
                severity: 'success',
            });
            setExpandedAccordion(false);
        } else {
            setSnackbar({
                open: true,
                message: t("settingsPage.errorMajPicture"),
                severity: 'error',
            });
        }
    };

    const handleUpdatePassword = async () => {
        if (isPasswordValid) {
            const result = await updateUser({password: newPassword});
            if (result) {
                setSnackbar({
                    open: true,
                    message: t("settingsPage.successPassword"),
                    severity: 'success',
                });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setExpandedAccordion(false);
            } else {
                setSnackbar({
                    open: true,
                    message: t("settingsPage.errorPassword"),
                    severity: 'error',
                });
            }
        } else {
            setSnackbar({
                open: true,
                message:t("settingsPage.errorEntry"),
                severity: 'error',
            });
        }
    };

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setProfilePicture(previewUrl);
            setProfilePictureFile(file);
        }
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {'image/*': []},
        multiple: false,
        onDrop
    });

    useEffect(() => {
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [profilePicture]);

    return (
        <Box
            sx={{
                minHeight: '80vh',
                bgcolor: 'transparent',
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: {xs: 1, sm: 2},
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <Card
                sx={{
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    bgcolor: theme.palette.background.paper,
                    position: 'relative',
                    zIndex: 2,
                    padding: {xs: 2, sm: 3}
                }}
            >
                <CardContent sx={{p: 0}}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold"
                                fontSize={{xs: '1.2rem', sm: '1.5rem'}}>
                        {t("settingsPage.settingsAccount")}
                    </Typography>

                    {/* Ajout de l'Avatar et du Pseudo de l'utilisateur */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
                        <Avatar
                            src={user?.profile_picture ? `http://localhost:8080${user.profile_picture}` : 'https://via.placeholder.com/150'}
                            alt="Photo de profil"
                            sx={{width: 60, height: 60}}
                        />
                        <Typography variant="h6" component="h2">
                            {user?.username}
                        </Typography>
                    </Stack>

                    <Divider sx={{mb: 2}}/>

                    {/* Section Pseudo */}
                    <Accordion
                        expanded={expandedAccordion === 'pseudo'}
                        onChange={handleAccordionChange('pseudo')}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon color="primary"/>
                                <Typography variant="h6">{t("settingsPage.modifySpeudo")}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1.5}>
                                <Typography variant="body2" color="text.secondary" sx={{fontSize: '0.8rem'}}>
                                    {t("settingsPage.actualSpeudo")} <strong>{user?.username}</strong>
                                </Typography>
                                <TextField
                                    type="text"
                                    label="Nouveau pseudo"
                                    variant="outlined"
                                    value={newPseudo}
                                    onChange={(e) => setNewPseudo(e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{style: {fontSize: '0.8rem'}}}
                                />
                                <Button variant="contained" onClick={handleUpdatePseudo} size="small">
                                    {t("settingsPage.register")}
                                </Button>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 1.5}}/>

                    {/* Section Photo de profil */}
                    <Accordion
                        expanded={expandedAccordion === 'photo'}
                        onChange={handleAccordionChange('photo')}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <PersonIcon color="primary"/>
                                <Typography variant="h6">{t("settingsPage.profilPicture")}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1.5}>
                                <Typography variant="body2" color="text.secondary" sx={{fontSize: '0.8rem'}}>
                                    {t("settingsPage.actualPicture")}
                                </Typography>
                                <Avatar
                                    src={user?.profile_picture ? `http://localhost:8080${user.profile_picture}` : 'https://via.placeholder.com/150'}
                                    alt="Ancienne photo de profil"
                                    sx={{width: 50, height: 50}}
                                />

                                <Typography variant="body2" color="text.secondary" sx={{fontSize: '0.8rem'}}>
                                  {t("settingsPage.newPictureOpt")}
                                </Typography>
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        border: '2px dashed var(--grey-dark)',
                                        borderRadius: 2,
                                        p: 1,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        minWidth: '150px',
                                        color: isDragActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        transition: 'border-color 0.2s ease-in-out',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <Typography variant="body2" color="var(--primary-color)"
                                                    sx={{fontSize: '0.75rem'}}>
                                            {t("settingsPage.dropPicture")}
                                        </Typography>
                                    ) : (
                                        <Typography variant="body2" sx={{fontSize: '0.75rem'}}>
                                           {t("settingsPage.sliderPicture")}
                                        </Typography>
                                    )}
                                </Box>
                                {profilePictureFile && (
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{mt: 1}}>
                                        <Avatar
                                            src={profilePicture || 'https://via.placeholder.com/150'}
                                            alt="Nouvelle photo de profil"
                                            sx={{width: 40, height: 40}}
                                        />
                                    </Stack>
                                )}

                                <Button variant="contained" onClick={handleUpdateProfilePicture} size="small">
                                  {t("settingsPage.savePicture")}
                                </Button>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 1.5}}/>

                    {/* Section Mot de passe */}
                    <Accordion
                        expanded={expandedAccordion === 'password'}
                        onChange={handleAccordionChange('password')}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LockIcon color="primary"/>
                                <Typography variant="h6">{t("settingsPage.modifyPassword")}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1.5}>
                                <TextField
                                    type="password"
                                    label={t("settingsPage.oldPassword")}
                                    variant="outlined"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{style: {fontSize: '0.8rem'}}}
                                />
                                <TextField
                                    type="password"
                                    label={t("settingsPage.newPassword")}
                                    variant="outlined"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{style: {fontSize: '0.8rem'}}}
                                />
                                <TextField
                                    type="password"
                                    label={t("settingsPage.confirmPassword")}
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    inputProps={{style: {fontSize: '0.8rem'}}}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleUpdatePassword}
                                    disabled={!isPasswordValid}
                                    size="small"
                                >
                                    {t("settingsPage.majPassword")}

                                </Button>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{my: 1.5}}/>

                    {/* Bouton Supprimer mon compte en dehors des accordéons */}
                    <Stack spacing={1} direction="row" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                                const confirmDelete = window.confirm(t("settingsPage.confirmDelete"));
                                if (confirmDelete) {
                                    try {
                                        console.log('Suppression du compte utilisateur ID:', userId);
                                        const response = await fetch(`${API_URL}/${userId}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Authorization': `Bearer ${token}`
                                            }
                                        });
                                        const data = await response.json();
                                        if (response.ok) {
                                            alert(t("settingsPage.deleteAccount"));
                                            logout();
                                        } else {
                                            alert(`t("settingsPage.errorDelete") ${data.message}`);
                                        }
                                    } catch (error) {
                                        console.error('Erreur lors de la suppression du compte:', error);
                                        alert(t("settingsPage.errorDelete"));
                                    }
                                }
                            }}
                            size="small"
                        >
                            {t("settingsPage.deleteAccountButton")}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Composant Snackbar pour les notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>

    );

};

export default SettingsPage;
