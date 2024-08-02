import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Typography, Button, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';
import { savePosition, fetchEvents } from '../../data/api';
import { useAccount } from '../../data/AccountProvider';

const PositionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {account} = useAccount();
    const [errorMessage, setErrorMessage] = useState('');
    const [eventList, setEventList] = useState([]);

    const [position, setPosition] = useState({
        id: null,
        name: '',
        minAge: '',
        maxAge: '',
        idealFor: '',
        contactName: '',
        contactEmail: '',
        eventId: '',
        recruitNum: '',
        recruitedNum: '',
        trainingDetail: '',
        workingCondition: '',
        accessibility: '',
        description: '',
        applicationAvailableTime: '',
        applicationDeadline: '',
        event: { requiredSkillTags: '' },
        organization: { logoUrl: '', name: '' },
    });
    const [isNew, setIsNew] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventList = async () => {
            try {
                const events = await fetchEvents(account?.organizationId);
                setEventList(events);
            } catch (error) {
                console.error('Error fetching event list:', error);
            }
        };

        fetchEventList();

        if (location.state?.position) {
            setPosition(location.state.position);
            setIsNew(false);
        } else {
            setIsNew(true);
        }
        setLoading(false);
    }, [id, location.state, account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPosition(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!position.name || !position.contactName || !position.contactEmail || 
            !position.description || !position.applicationAvailableTime || !position.applicationDeadline) {
            setErrorMessage('Please fill in all required fields.');
            return false;
        }
        if (parseInt(position.minAge) >= parseInt(position.maxAge)) {
            setErrorMessage('Minimum age must be less than maximum age.');
            return false;
        }
        if (parseInt(position.recruitNum) <= 0) {
            setErrorMessage('Recruit number must be greater than 0.');
            return false;
        }
        if (new Date(position.applicationDeadline) <= new Date()) {
            setErrorMessage('Application deadline must be in the future.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await savePosition(position);
            if (res.data.success) {
                setErrorMessage('');
                navigate('/positions');
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            console.error('Error saving position:', error);
            setErrorMessage('An error occurred while saving the position.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <Sidebar />
            <main className="content">
                <Topbar />
                <Box m="20px">
                    <Typography variant="h4" color={colors.greenAccent[500]}>
                        {isNew ? 'Create New Position' : 'Edit Position'}
                    </Typography>
                    {errorMessage && (
                        <Typography color="error" sx={{ mt: 2 }}>{errorMessage}</Typography>
                    )}
                    <Box mt={2} component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Position Name"
                                    name="name"
                                    value={position.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Minimum Age"
                                    name="minAge"
                                    type="number"
                                    value={position.minAge}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Maximum Age"
                                    name="maxAge"
                                    type="number"
                                    value={position.maxAge}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Ideal For"
                                    name="idealFor"
                                    value={position.idealFor}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Contact Name"
                                    name="contactName"
                                    value={position.contactName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Contact Email"
                                    name="contactEmail"
                                    type="email"
                                    value={position.contactEmail}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Event</InputLabel>
                                    <Select
                                        name="eventId"
                                        value={position.eventId}
                                        onChange={handleChange}
                                        required
                                    >
                                        {eventList.map((event) => (
                                            <MenuItem key={event.id} value={event.id}>
                                                {event.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Recruit Number"
                                    name="recruitNum"
                                    type="number"
                                    value={position.recruitNum}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Training Detail"
                                    name="trainingDetail"
                                    value={position.trainingDetail}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Working Condition"
                                    name="workingCondition"
                                    value={position.workingCondition}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Accessibility"
                                    name="accessibility"
                                    value={position.accessibility}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={position.description}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Application Available Time"
                                    type="datetime-local"
                                    name="applicationAvailableTime"
                                    value={position.applicationAvailableTime}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Application Deadline"
                                    type="datetime-local"
                                    name="applicationDeadline"
                                    value={position.applicationDeadline}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="start" gap={1} mt={2}>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: colors.greenAccent[600],
                                    }
                                }}
                            >
                                {isNew ? 'Create' : 'Update'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/positions')}
                                sx={{
                                    backgroundColor: colors.redAccent[500],
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: colors.redAccent[600],
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </main>
        </div>
    );
};

export default PositionForm;