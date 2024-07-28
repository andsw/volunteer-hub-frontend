import { tokens } from "../../theme";
import useAuthRedirect from "../../firebase/useAuthRedirect";
import React, { useState, useEffect } from 'react';
import { useTheme } from "@mui/material";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Button
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SchoolIcon from '@mui/icons-material/School';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import WcIcon from '@mui/icons-material/Wc';
import Sidebar from "../global/Sidebar";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { styled } from '@mui/material/styles';
import { useAccount } from '../../data/AccountProvider';
import { getAccountByAccountId } from "../../data/api";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));

const Profile = () => {
  useAuthRedirect();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const { account, loadingAccount } = useAccount();
  const {id} = useParams();

  useEffect(() => {
    if (id) {
      const fetchAccountData = async () => {
        try {
          const accountData = await getAccountByAccountId(id);
          setProfile(accountData);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAccountData();
    } else {
      setProfile(account);
    }
  }, [id, loadingAccount]);

  if (loadingAccount) {
    return <Typography>Loading account...</Typography>;
  }
  
  if (id && !profile?.email) {
    return <Typography>Account profile not found</Typography>;
  }

  const isVolunteer = account?.accountType === 'volunteer';

  const renderCommonInfo = () => (
    <>
      <ListItem>
        <LocalPostOfficeIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Email" secondary={profile?.email || ''} />
      </ListItem>
      <ListItem>
        <LocalPhoneIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Phone" secondary={profile?.phone || ''} />
      </ListItem>
      <ListItem>
        <ControlCameraIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Address" secondary={profile?.address || ''} />
      </ListItem>
      <ListItem>
        <LocationCityIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="City" secondary={profile?.city || ''} />
      </ListItem>
      <ListItem>
        <HomeIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Province" secondary={profile?.province || ''} />
      </ListItem>
      <ListItem>
        <LanguageIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Country" secondary={profile?.country || ''} />
      </ListItem>
      <ListItem>
        <LocalPostOfficeIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Postcode" secondary={profile?.postcode || ''} />
      </ListItem>
    </>
  );

  const renderVolunteerInfo = () => (
    <>
      <ListItem>
        <CalendarTodayIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Date of Birth" secondary={new Date(profile?.dob).toLocaleDateString()} />
      </ListItem>
      <ListItem>
        <WcIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Sex" secondary={profile?.sex || ''} />
      </ListItem>
      <ListItem>
        <PublicIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Nationality" secondary={profile?.nationality || ''} />
      </ListItem>
      <ListItem>
        <FavoriteIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Marital Status" secondary={profile?.maritalStatus || ''} />
      </ListItem>
      <ListItem>
        <WorkOutlineIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Occupation Status" secondary={profile?.occupationStatus || ''} />
      </ListItem>
      <ListItem>
        <DirectionsCarIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Has Driver's License" secondary={profile?.hasDriversLicence === 'true' ? 'Yes' : 'No'} />
      </ListItem>
      <ListItem>
        <DriveFileRenameOutlineIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Skills" secondary={profile?.skills || ''} />
      </ListItem>
      <ListItem>
        <SchoolIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Academic Certificate" secondary={profile?.academicCertificate || ''} />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Resume"
          secondary={
            profile?.resumeLink ? (
              <Link href={profile?.resumeLink} target="_blank" rel="noopener noreferrer">
                View Resume
              </Link>
            ) : 'Not provided'
          }
        />
      </ListItem>
    </>
  );

  const renderOrganizationInfo = () => (
    <>
      <ListItem>
        <PeopleAltIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
        <ListItemText primary="Organization Name" secondary={profile?.name} />
      </ListItem>
      <ListItem>
        <Link href={profile?.officialSiteLink} target="_blank" rel="noopener noreferrer">
          <RssFeedIcon sx={{ mr: 2, color: colors.greenAccent[400] }} />
          <ListItemText
            primary="Official Website"
            secondary={profile?.officialSiteLink || 'Not provided'}
          />
        </Link>
      </ListItem>
    </>
  );

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Profile" subtitle="Detailed Account Information" />
          <Container maxWidth="md">
            <ProfilePaper elevation={3}>
              <Grid container spacing={3} alignItems="center" direction="column">
                <Grid item>
                  <LargeAvatar
                    src={profile?.avatarImgUrl}
                    alt={isVolunteer ? `${profile?.firstName} ${profile?.lastName}` : profile?.name}
                    sx={{ backgroundColor: colors.greenAccent[400] }}
                  >
                    {isVolunteer ? `${profile?.firstName ? profile?.firstName[0] : ''}` : `${profile?.name ? profile?.name[0] : ''}`}
                  </LargeAvatar>
                </Grid>
                <Grid item>
                  <Typography variant="h4" gutterBottom sx={{ color: colors.greenAccent[400] }}>
                    {isVolunteer ? `${profile?.firstName || '?'} ${profile?.lastName || '?'}` : `${profile?.name || ''}`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" color={colors.grey[500]}>
                    {isVolunteer ? 'Volunteer' : 'Organization'}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <List>
                {renderCommonInfo()}
                {isVolunteer ? renderVolunteerInfo() : renderOrganizationInfo()}
              </List>
              <Button
                color="secondary"
                variant="contained"
                sx={{ mt: 3, backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}
                onClick={() => navigate('/profile-form', { state: { profile: profile } })}
              >
                Edit Profile
              </Button>
            </ProfilePaper>
          </Container>
        </Box>
      </main>
    </div>
  );
};
export default Profile;