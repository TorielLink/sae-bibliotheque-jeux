const { privacySettings} = require('../database/sequelize');

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const privacySettingsData = await privacySettings.findAll();
        res.status(200).json({ message: 'Privacy settings fetched successfully', data: privacySettingsData });
    } catch (error) {
        console.error('Error fetching game platforms:', error);
        res.status(500).json({ message: 'Error fetching game platforms', error: error.message });
    }
};

module.exports = controller;
