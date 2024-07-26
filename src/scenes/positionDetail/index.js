import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Avatar, Button } from '@mui/material';
import { tokens } from "../../theme";
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { getPositionDetail } from '../../data/api';
import ButtonGroup from '@mui/material/ButtonGroup';

const PositionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [position, setPosition] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isSidebar, setIsSidebar] = React.useState(true);

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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!position) {
    return <div>Position not found</div>;
  }

  const handleEdit = () => {
    navigate(`/position-form`, {state: {position}});
  };

  const handleDelete = () => {
    // Implement delete logic
    alert('Position deleted');
    navigate('/position');
  };

  const handleBackToList = () => {
    navigate('/position');
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Typography variant="h4" color={colors.greenAccent[500]}>
            Position Details
          </Typography>
          <Typography variant="h6" color="textSecondary">
            {position.name}
          </Typography>
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" color={colors.greenAccent[500]}>
                  {position.name}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Ideal For: {position.idealFor}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Avatar src={position.organization.logoUrl} sx={{ mr: 2, width: 50, height: 50 }} />
                  <Typography component="a" href={`/events/${position.event.organizationId}`} sx={{ textDecoration: 'none', color: colors.greenAccent[500] }}>
                    {position.organization.name}
                  </Typography>
                </Box>
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
                  <FavoriteIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Recruitment Target: {position.recruitNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <GradeIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Recruited: {position.recruitedNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CommentIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Reviews: {position.recruitNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
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
                  <Button
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
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDelete}
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      }
                    }}
                  >
                    Delete
                  </Button>
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
        </Box>
      </main>
    </div>
  );
};

export default PositionDetail;
