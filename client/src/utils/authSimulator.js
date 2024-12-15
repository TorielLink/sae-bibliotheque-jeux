export const simulateLogin = () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoibmljbzEyIiwiaWF0IjoxNzMzNzUwNjE3fQ.Ef1AlgYkKDhuTSAQEV9ZQ1mbtc1lUSK8EN7GTp3jAuM'; // Remplacez par un token JWT valide si possible
  const mockUser = {
    id: 15,
    username: 'testuser',
    email: 'testuser@example.com',
    profile_picture: '/uploads/profile_pictures/profile_picture-1733920048860-972297989.jpg',
  };

  // Stockez le token et l'utilisateur dans localStorage
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));

  console.log('Utilisateur connecté simulé. Token ajouté à localStorage.');
};

export const simulateLogout = () => {
  // Supprimez les données de localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  console.log('Utilisateur déconnecté simulé. localStorage réinitialisé.');
};
