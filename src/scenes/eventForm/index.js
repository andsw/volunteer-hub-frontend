import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Grid, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../global/Sidebar';
import { tokens } from "../../theme";
import Topbar from '../global/Topbar';
import Header from '../../components/Header';
import { saveEvent } from '../../data/api';
import { useAccount } from '../../data/AccountProvider';

const EventForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const {loadingAccount, account} = useAccount();
  
  const { event } = location.state || {};

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    venue: '',
    eventStartTime: '',
    eventEndTime: '',
    description: '',
    requiredSkillTags: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        subtitle: event.subtitle || '',
        venue: event.venue || '',
        eventStartTime: event.eventStartTime || '',
        eventEndTime: event.eventEndTime || '',
        description: event.description || '',
        requiredSkillTags: event.requiredSkillTags || ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., sending data to an API
    console.log('Form data:', formData);
    saveEvent({
      ...formData,
      organizationId: account.organizationId
    })
    // Redirect to events list or another page
    navigate('/events');
  };

  if (loadingAccount) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        <Box m="20px">
          <Header title={event?"Edit Event":"Add Event"} subtitle={formData.title} />
          <Paper
            elevation={3}
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: colors.primary[400],
              color: theme.palette.primary[100],
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                        sx: {
                          color: colors.greenAccent[300], // Set the label color
                          '&.Mui-focused': {
                            color: colors.greenAccent[300], // Change color when focused
                          },
                        },
                      }}
                  />
                  <TextField
                    fullWidth
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Start Time"
                    name="eventStartTime"
                    value={formData.eventStartTime}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="End Time"
                    name="eventEndTime"
                    value={formData.eventEndTime}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Required Skills"
                    name="requiredSkillTags"
                    value={formData.requiredSkillTags}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300], // Set the label color
                        '&.Mui-focused': {
                          color: colors.greenAccent[300], // Change color when focused
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="start" gap={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: theme.palette.grey[100],
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        '&:hover': {
                          backgroundColor: colors.greenAccent[700],
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/eventDetail/${event.id}`)}
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        color: theme.palette.grey[100],
                        fontSize: '14px',
                        fontWeight: 'bold',
                        padding: '10px 20px',
                        '&:hover': {
                          backgroundColor: colors.greenAccent[700],
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </main>
    </div>
  );
};

export default EventForm;
