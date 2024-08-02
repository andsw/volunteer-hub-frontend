import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, ButtonGroup, Button, Grid, Paper, Avatar, useTheme, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import ListAltIcon from '@mui/icons-material/ListAlt';
import WorkIcon from '@mui/icons-material/Work';
import { format } from 'date-fns';
import { ExpandLess } from '@mui/icons-material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { deleteEvent, deleteObject } from '../../data/api';

import { getEventDetail } from '../../data/api';

const EventDetail = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [openReviews, setOpenReviews] = useState(false);
  const [reviews, setReviews] = useState({});

  const handleToggleReviews = () => {
    setOpenReviews(!openReviews);
  };

  React.useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const data = await getEventDetail(parseInt(id));
        data.positions = data.positions.filter((p) => p.id !== null)
        setEvent(data);
        setReviews(JSON.parse(data.reviewsJson));
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const [isSidebar, setIsSidebar] = React.useState(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Event Details" subtitle={event.title} />
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              }
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h3" color={colors.greenAccent[400]}>
                  {event.title}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {event.subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BusinessIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Avatar src={event.organization?.logoUrl} sx={{ mr: 2, width: 20, height: 20 }} />
                  <Typography component="a" href="#" sx={{ color: colors.greenAccent[400], textDecoration: 'none' }}>
                    {event.organization?.name || 'Unknown'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>Venue: {event.venue}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarTodayIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>
                    Date: {format(new Date(event.eventStartTime), "yyyy/MM/dd")}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>
                    Time: {format(new Date(event.eventStartTime), "hh:mm a")} - {format(new Date(event.eventEndTime), "hh:mm a")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <FavoriteIcon sx={{ mr: 1, color: colors.redAccent[400] }} />
                  <Typography>Likes: {event.likesNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <GradeIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                  <Typography>Collections: {event.collectionsNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                <CommentIcon sx={{ mr: 1, color: colors.blueAccent[500] }} />
                  <Typography>Reviews: {event.reviewsNum}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>Joined Volunteers: {event.joinedVolunteerNum}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={2}>
                  <ListAltIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                  <Typography>Required Skills: {event.requiredSkillTags}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" color={colors.greenAccent[400]} mb={2}>
                  Event Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: event.description }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" color={colors.greenAccent[400]} mb={2}>
                  Positions
                </Typography>
                {(event.positions && event.positions.length != 0) || <Box display='flex' flexDirection="column">
                  <h4 style={{ color: colors.greenAccent[400] }}>no positions</h4>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/position-form')}
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: colors.grey[100],
                      width: "170px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                      }
                    }}
                  >
                    Create a position?
                  </Button>
                </Box>}
                <List>
                  {event.positions.map((position) => {
                    return <ListItem key={position.id} component="a" onClick={() => { navigate(`/position-detail/${position.id}`) }} sx={{ color: colors.grey[100], cursor: 'pointer', textDecoration: 'none' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: colors.greenAccent[600] }}>
                          <WorkIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={position.name} secondary={`Recruits: ${position.recruitNum}`} />
                    </ListItem>
                  })}
                </List>
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup>
                  (isVolunteer && <Button
                    variant="contained"
                    onClick={() => navigate('/event-form', { state: { event } })}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      color: 'white',
                      '&:hover': {
                        backgroundColor: colors.greenAccent[600],
                      }
                    }}
                  >
                    Edit
                  </Button>)
                  (isVolunteer && <Button
                    variant="contained"
                    onClick={async () => {
                      await deleteEvent(event.id)
                      navigate('/events')
                    }}
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      }
                    }}
                  >
                    Delete
                  </Button>)
                  <Button
                    variant="contained"
                    onClick={() => navigate('/events')}
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

          {/* Review Section */}
          <Box mt={4}>
            <Button
              variant="outlined"
              onClick={handleToggleReviews}
              fullWidth
              sx={{
                marginTop: '-10px',
                backgroundColor: colors.greenAccent[700],
                color: colors.grey[100],
                '&:hover': {
                  backgroundColor: colors.blueAccent[700],
                },
              }}
              endIcon={openReviews ? <ExpandLess /> : <ExpandMore />}
            >
              {openReviews ? 'Hide Reviews' : 'Show Reviews'}
            </Button>
            <Collapse in={openReviews}>
              <Box mt={2}>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <Box
                      key={index}
                      mb={2}
                      p={2}
                      borderRadius="4px"
                      bgcolor={colors.primary[400]}
                      color={colors.grey[100]}
                      sx={{ border: `1px solid ${colors.greenAccent[300]}` }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar src={review.volunteer_avatar_link}
                          style={{ width: 25, height: 25, borderRadius: '50%', marginRight: 10 }}
                          alt={`${review.volunteer_name} ${review.volunteer_name}`}>
                          {review.volunteer_name[0]}
                        </Avatar>
                        <Typography variant="body1" color={colors.greenAccent[400]}>
                          {review.volunteer_name} ({review.volunteer_position_name})
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: review.content }} />
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography variant="body2" color={colors.grey[400]}>
                          {format(new Date(review.review_time), 'yyyy/MM/dd HH:mm')}
                        </Typography>
                        <Box ml={2} display="flex" alignItems="center">
                          <Typography variant="body2" color={colors.grey[400]}>
                            <ThumbUpOffAltIcon sx={{ color: colors.grey[400] }} />
                            {review.review_likes_num}
                          </Typography>
                        </Box>
                      </Box>
                      {review.hosts_reply && (
                        <Box mt={2} p={1} borderRadius="4px" bgcolor={colors.primary[200]} color={colors.grey[100]}>
                          <Typography variant="body2" color={colors.greenAccent[400]}>
                            Host Reply:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: review.hosts_reply }} />
                          <Typography variant="body2" color={colors.grey[400]}>
                            {format(new Date(review.reply_time), 'yyyy/MM/dd HH:mm')} - {review.reply_likes_num} Likes
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography>No reviews available.</Typography>
                )}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default EventDetail;
