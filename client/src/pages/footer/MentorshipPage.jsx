import React from 'react';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTranslation} from 'react-i18next';

const MentorshipPage = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const styles = getStyles(theme);

    return (
        <div style={styles.page}>
            {isMobile && (
                <div style={styles.linksContainer}>
                    <a href="/project" style={styles.mobileLink}>
                        {t("mentorship.discoverProject")}
                    </a>
                </div>
            )}

            <h1 style={styles.header}>{t("footer.mentorship")}</h1>
            <p style={styles.text}>
                {t("mentorship.description")}
            </p>

            {/* Section : Mentor */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid ' + theme.palette.colors.red}}>
                    {t("mentorship.referent.title")}</h2>
                <div style={{...styles.mentor, flexDirection: isMobile ? 'column' : 'row'}}>
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Jérôme FESSY"
                        style={styles.mentorOrInvestorImage}
                    />
                    <div>
                        <h3 style={styles.mentorOrInvestorName}>Jérôme FESSY</h3>
                        <p style={styles.mentorOrInvestorRole}>
                            {t("mentorship.referent.role")}
                        </p>
                        <p style={styles.text}>
                            {t("mentorship.referent.description")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section : Investisseurs */}
            <div style={styles.section}>
                <h2 style={{...styles.subHeader, borderBottom: '2px solid ' + theme.palette.colors.yellow}}>
                    {t("mentorship.investors.title")}</h2>
                <div style={styles.investors}>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor1.png"
                            alt="Investisseur"
                            style={styles.mentorOrInvestorImage}
                        />
                        <h4 style={styles.mentorOrInvestorName}>Alex Dupont</h4>
                        <p style={styles.mentorOrInvestorRole}>{t("mentorship.investors.role.1")}, StartupTech</p>
                    </div>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor2.png"
                            alt="Investisseur"
                            style={styles.mentorOrInvestorImage}
                        />
                        <h4 style={styles.mentorOrInvestorName}>Marie Leblanc</h4>
                        <p style={styles.mentorOrInvestorRole}>{t("mentorship.investors.role.2")}, InnovInvest</p>
                    </div>
                    <div style={styles.investorCard}>
                        <img
                            src="/images/investor3.png"
                            alt="Investisseur"
                            style={styles.mentorOrInvestorImage}
                        />
                        <h4 style={styles.mentorOrInvestorName}>Julien Moreau</h4>
                        <p style={styles.mentorOrInvestorRole}>{t("mentorship.investors.role.3")}, Future Ventures</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getStyles = (theme) => ({
    page: {
        padding: '1.25rem',
        fontFamily: theme.typography.fontFamily,
    },
    header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
    },
    text: {
        fontSize: '1rem',
        color: theme.palette.text.primary,
        marginBottom: '1.25rem',
    },
    section: {
        marginBottom: '1.875rem',
    },
    subHeader: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.625rem',
        paddingBottom: '0.3125rem',
    },
    mentor: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
    },
    mentorOrInvestorImage: {
        width: '9.375rem',
        height: '9.375rem',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '0.625rem',
    },
    mentorOrInvestorName: {
        fontSize: '1rem',
        fontWeight: 'bold',
        margin: '0',
    },
    mentorOrInvestorRole: {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        margin: '0.1875rem 0 0.625rem 0',
    },
    investors: {
        display: 'flex',
        gap: '1.25rem',
        flexWrap: 'wrap',
    },
    investorCard: {
        textAlign: 'center',
        flex: '1',
        minWidth: '7.5rem',
        maxWidth: '11.25rem',
    },
    mobileLink: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: theme.palette.colors.blue,
        textDecoration: 'none',
        border: '1px solid ' + theme.palette.colors.blue,
        padding: '0.25rem 0.5rem',
        borderRadius: '0.3125rem',
        transition: 'background-color 0.3s, color 0.3s',
    },
});

export default MentorshipPage;
