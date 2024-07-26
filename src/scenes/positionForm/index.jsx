import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, TextField, Typography, Button, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from "../../theme";
import Topbar from '../global/Topbar';
import Sidebar from '../global/Sidebar';

const PositionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [position, setPosition] = React.useState({
        name: '',
        idealFor: '',
        workingCondition: '',
        applicationAvailableTime: '',
        applicationDeadline: '',
        contactName: '',
        contactEmail: '',
        description: '',
        organization: { logoUrl: '', name: '' },
        event: { requiredSkillTags: '' },
    });
    const [isNew, setIsNew] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (location.state?.position) {
            setPosition(location.state.position);
            setIsNew(false);
            setLoading(false);
        } else {
            setIsNew(true);
            setLoading(false);
        }
    }, [id, location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPosition(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                // await createPosition(position);
            } else {
                // await updatePosition(position);
            }
            navigate('/positions');
        } catch (error) {
            console.error('Error saving position:', error);
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
                    <Box mt={2} component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Position Name"
                                    name="name"
                                    value={position?.name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Ideal For"
                                    name="idealFor"
                                    value={position?.idealFor || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Working Condition"
                                    name="workingCondition"
                                    value={position?.workingCondition || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Application Available Time"
                                    type="datetime-local"
                                    name="applicationAvailableTime"
                                    value={position?.applicationAvailableTime || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Application Deadline"
                                    type="datetime-local"
                                    name="applicationDeadline"
                                    value={position?.applicationDeadline || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Contact Name"
                                    name="contactName"
                                    value={position?.contactName || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Contact Email"
                                    name="contactEmail"
                                    value={position?.contactEmail || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Position Description"
                                    name="description"
                                    value={position?.description || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Avatar src={position?.organization.logoUrl || ''} sx={{ width: 100, height: 100, mb: 2 }} />
                                <Typography variant="h6" color={colors.greenAccent[500]}>
                                    {position?.organization.name || 'Organization Name'}
                                </Typography>
                                <Typography variant="h6" color={colors.greenAccent[500]}>
                                    Required Skills: {position?.event.requiredSkillTags || 'N/A'}
                                </Typography>
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
