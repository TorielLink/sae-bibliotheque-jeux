export const simulateLogin = (token = null, user = null) => {
    const mockToken =
        token ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicHJvZmlsZV9waWN0dXJlIjoiL3VwbG9hZHMvcHJvZmlsZV9waWN0dXJlcy9wcm9maWxlX3BpY3R1cmUtcHJlZGVmYXVkLmpwZyJ9.hRI7dVpjQeqPEuk7zpWitVqWDEH7XlWx2cYq7NmrhsI'; // Token par défaut
    const mockUser =
        user || {
            id: 15,
            username: 'testuser',
            email: 'testuser@example.com',
            profile_picture: '/uploads/profile_pictures/profile_picture-1733920048860-972297989.jpg',
        };

    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));

    // console.log('Utilisateur connecté simulé. Token ajouté à localStorage.');
};


