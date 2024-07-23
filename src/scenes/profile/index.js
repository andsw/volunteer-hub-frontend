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
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { styled } from '@mui/material/styles';
import { useAccount } from '../../data/AccountProvider';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
}));

const Profile = () => {
  useAuthRedirect();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { account } = useAccount()
  const profile = account;
  const [isSidebar, setIsSidebar] = useState(true);
  console.log(profile);
  const navigate = useNavigate()

  if (!profile) {
    return <Typography>Loading profile...</Typography>;
  }

  const isVolunteer = profile.accountType === 'volunteer';

  const renderCommonInfo = () => (
    <>
      <ListItem>
        <ListItemText primary="Email" secondary={profile.email} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Phone" secondary={profile.phone} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Address" secondary={profile.address} />
      </ListItem>
      <ListItem>
        <ListItemText primary="City" secondary={profile.city} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Province" secondary={profile.province} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Country" secondary={profile.country} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Postcode" secondary={profile.postcode} />
      </ListItem>
    </>
  );

  const renderVolunteerInfo = () => (
    <>
      <ListItem>
        <ListItemText sx={{ mb: 2, fontSize: 25, fontWeight: 'bolder' }} primary="Date of Birth" secondary={new Date(profile.dob).toLocaleDateString()} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Sex" secondary={profile.sex} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Nationality" secondary={profile.nationality} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Marital Status" secondary={profile.maritalStatus} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Occupation Status" secondary={profile.occupationStatus} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Has Driver's License" secondary={profile.hasDriversLicence ? 'Yes' : 'No'} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Skills" secondary={profile.skills} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Academic Certificate" secondary={profile.academicCertificate} />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Resume"
          secondary={
            profile.resumeLink ? (
              <Link href={profile.resumeLink} target="_blank" rel="noopener noreferrer">
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
        <ListItemText primary="Organization Name" secondary={profile.name} />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Official Website"
          secondary={
            profile.officialSiteLink ? (
              <Link href={profile.officialSiteLink} target="_blank" rel="noopener noreferrer">
                {profile.officialSiteLink}
              </Link>
            ) : 'Not provided'
          }
        />
      </ListItem>
    </>
  );

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header
            title="Profile"
            subtitle="Detailed Account Information"
          />
          <Typography color={colors.greenAccent[400]} sx={{ mb: 2, fontSize: 25, fontWeight: 'bolder' }}>
            {prompt}
          </Typography>
          <Container maxWidth="md">
            <ProfilePaper elevation={3}>
              <Grid container spacing={3} alignItems="center" direction="column">
                <Grid item>
                  <LargeAvatar src={profile.avatarImgUrl} alt={isVolunteer ? `${profile.firstName} ${profile.lastName}` : profile.name}>
                    {isVolunteer ? `${profile.firstName[0]}${profile.lastName[0]}` : profile.name[0]}
                  </LargeAvatar>
                </Grid>
                <Grid item>
                  <Typography variant="h4" gutterBottom>
                    {isVolunteer ? `${profile.firstName} ${profile.lastName}` : profile.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" color="textSecondary">
                    {isVolunteer ? 'Volunteer' : 'Organization'}
                  </Typography>
                </Grid>
              </Grid>
              <Divider style={{ margin: '20px 0' }} />
              <List>
                {renderCommonInfo()}
                {isVolunteer ? renderVolunteerInfo() : renderOrganizationInfo()}
              </List>
              <Button color="secondary" variant="contained" style={{ marginTop: 20 }}
                      onClick={() => navigate('/profileForm')}>
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