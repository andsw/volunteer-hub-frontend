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
  const { loadingAccount, account } = useAccount();

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        subtitle: event.subtitle || '',
        venue: event.venue || '',
        eventStartTime: event.eventStartTime ? new Date(event.eventStartTime).toISOString().slice(0, 16) : '',
        eventEndTime: event.eventEndTime ? new Date(event.eventEndTime).toISOString().slice(0, 16) : '',
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subtitle.trim()) newErrors.subtitle = 'Subtitle is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.eventStartTime) newErrors.eventStartTime = 'Start time is required';
    if (!formData.eventEndTime) newErrors.eventEndTime = 'End time is required';

    if (formData.eventStartTime && new Date(formData.eventStartTime) <= now) {
      newErrors.eventStartTime = 'Start time must be in the future';
    }

    if (formData.eventEndTime && new Date(formData.eventEndTime) <= now) {
      newErrors.eventEndTime = 'End time must be in the future';
    }

    if (formData.eventStartTime && formData.eventEndTime) {
      const startTime = new Date(formData.eventStartTime);
      const endTime = new Date(formData.eventEndTime);
      
      // Ensure both dates are valid
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        newErrors.eventEndTime = 'Invalid date format';
      } else {
        // Extract the year, month, and date for both times
        const startYear = startTime.getFullYear();
        const startMonth = startTime.getMonth();
        const startDate = startTime.getDate();
        
        const endYear = endTime.getFullYear();
        const endMonth = endTime.getMonth();
        const endDate = endTime.getDate();
        
        // Check if they are on the same day
        if (startYear === endYear && startMonth === endMonth && startDate === endDate) {
          // Compare the detailed time
          if (startTime >= endTime) {
            newErrors.eventEndTime = 'End time must be after start time';
          }
        } else if (startTime >= endTime) {
          // If they are not on the same day, no need for this specific check
          newErrors.eventEndTime = 'End time must be after start time';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const res = await saveEvent({
        ...formData,
        organizationId: account.organizationId
      });
      navigate('/events');
    }
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
          <Header title={event ? "Edit Event" : "Add Event"} subtitle={formData.title} />
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
              <input type='hidden' name='id' value={event?.id}/>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
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
                    error={!!errors.subtitle}
                    helperText={errors.subtitle}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
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
                    error={!!errors.venue}
                    helperText={errors.venue}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
                        },
                      },
                    }}
                  />
                  <Typography variant="body1" color={colors.greenAccent[300]}>
                    Start Time
                  </Typography>
                  <TextField
                    type="datetime-local"
                    name="eventStartTime"
                    value={formData.eventStartTime}
                    onChange={handleChange}
                    error={!!errors.eventStartTime}
                    helperText={errors.eventStartTime}
                    sx={{ mb: 2, width: '100%' }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
                        },
                      },
                    }}
                  />
                  <Typography variant="body1" color={colors.greenAccent[300]}>
                    End Time
                  </Typography>
                  <TextField
                    type="datetime-local"
                    name="eventEndTime"
                    value={formData.eventEndTime}
                    onChange={handleChange}
                    error={!!errors.eventEndTime}
                    helperText={errors.eventEndTime}
                    sx={{ mb: 2, width: '100%' }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
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
                    error={!!errors.description}
                    helperText={errors.description}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: {
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
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
                        color: colors.greenAccent[300],
                        '&.Mui-focused': {
                          color: colors.greenAccent[300],
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
                      onClick={() => navigate(event ? `/event-detail/${event?.id}` : '/events')}
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