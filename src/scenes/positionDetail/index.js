import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Tooltip, Fab, Paper, Avatar, Button } from '@mui/material';
import { tokens } from "../../theme";
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import CommentIcon from '@mui/icons-material/Comment';
import Header from "../../components/Header";
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { deletePosition, getPositionDetail } from '../../data/api';
import ButtonGroup from '@mui/material/ButtonGroup';
import MessageIcon from '@mui/icons-material/Message';
import { useAccount } from '../../data/AccountProvider';
import { saveApplication } from '../../data/api';
import { useState } from 'react';

const PositionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('')
  const [position, setPosition] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isSidebar, setIsSidebar] = React.useState(true);
  const { account, loadingAccount } = useAccount();
  const isVolunteer = account && account.accountType === 'volunteer'
  const isOrganization = account && account.accountType === 'organization'

  React.useEffect(() => {
    const fetchPositionDetail = async () => {
      try {
        const data = await getPositionDetail(parseInt(id));
        setPosition(data);
      } catch (error) {
        console.error('Error fetching position details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositionDetail();
  }, [id, account]);

  if (loading || loadingAccount) {
    return <div>Loading...</div>;
  }

  if (!position) {
    return <div>Position not found</div>;
  }

  const handleEdit = () => {
    navigate(`/position-form`, { state: { position } });
  };

  const handleDelete = async (id) => {
    await deletePosition(id)
    navigate('/positions');
  };

  const handleBackToList = () => {
    navigate('/positions');
  };

  const handleApply = async () => {
    await saveApplication({
      positionId: position.id,
      volunteerId: account.volunteerId
    }).then(res => {
      if (res.data.success) {
        const subject = encodeURIComponent(`Application for ${position.name}`);
        const body = encodeURIComponent(`Dear ${position.contactName},
  
      I am writing to apply for the position of ${position.name} at ${position.organization.name}.
      
      [Your application message here (or attach your resume)]
      
      Thank you for your consideration.
      
      Best regards,
      ${account.firstName}`);

        const mailtoLink = `mailto:${position.contactEmail}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        setErrorMessage('');
        navigate('/applications')
      } else {
        setErrorMessage(res.data.message);
      }
    }).catch(e => {
      console.error(e);
    })
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Position Details" subtitle={position.name} />
          {errorMessage && (
            <span className='error-message'>{errorMessage}</span>
          )}
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" color={colors.greenAccent[500]}>
                  {position.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {
                  position.organization &&
                  <Box display="flex" alignItems="center" mb={2}>
                    <BusinessIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Avatar src={position.organization?.logoUrl} sx={{ mr: 2, width: 50, height: 50 }} />
                    <Typography component="a" href={`/events/${position.event.organizationId}`} sx={{ textDecoration: 'none', color: colors.greenAccent[500] }}>
                      {position.organization.name}
                    </Typography>
                  </Box>
                }
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Working Condition: {position.workingCondition}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarTodayIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Application Period: {new Date(position.applicationAvailableTime).toLocaleDateString()} - {new Date(position.applicationDeadline).toLocaleDateString()}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>
                    Application Time: {new Date(position.applicationAvailableTime).toLocaleTimeString()} - {new Date(position.applicationDeadline).toLocaleTimeString()}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Contact: {position.contactName}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Email: {position.contactEmail}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <FavoriteIcon sx={{ mr: 1, color: colors.redAccent[400] }} />
                  <Typography>Recruitment Target: {position.recruitNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <GradeIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Recruited: {position.recruitedNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CommentIcon sx={{ mr: 1, color: colors.blueAccent[500] }} />
                  <Typography>Reviews: {position.recruitNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>Joined Volunteers: {position.recruitedNum}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <ListAltIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Required Skills: {position.event.requiredSkillTags}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" color={colors.greenAccent[500]} mb={2}>
                  Position Description
                </Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: position.description }} />
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup>
                  {isVolunteer && (
                    <Button
                      variant="contained"
                      onClick={() => handleApply()}
                      sx={{
                        backgroundColor: colors.blueAccent[500],
                        color: 'white',
                        '&:hover': {
                          backgroundColor: colors.blueAccent[600],
                        }
                      }}
                    >
                      Apply
                    </Button>
                  )}
                  {isOrganization && <Button
                    variant="contained"
                    onClick={handleEdit}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      color: 'white',
                      '&:hover': {
                        backgroundColor: colors.greenAccent[600],
                      }
                    }}
                  >
                    Edit
                  </Button>}
                  {isOrganization && <Button
                    variant="contained"
                    onClick={()=>handleDelete(position.id)}
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      }
                    }}
                  >
                    Delete
                  </Button>}
                  <Button
                    variant="contained"
                    onClick={handleBackToList}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      color: 'white',
                      '&:hover': {
                        backgroundColor: colors.greenAccent[600],
                      }
                    }}
                  >
                    Back to List
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Paper>
          <Tooltip title="talk with organizer?">
            <span>
              {isVolunteer && <Fab
                color="primary"
                aria-label="add"
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  '&:hover': {
                    backgroundColor: colors.blueAccent[400],
                  }
                }}
                onClick={() => navigate('/message', {
                  state: {
                    toId: position.organization.id,
                    toName: position.organization.name,
                    positionId: position.id,
                    positionName: position.name
                  }
                })}
              >
                <MessageIcon />
              </Fab>}
            </span>
          </Tooltip>
        </Box>
      </main>
    </div>
  );
};

export default PositionDetail;
