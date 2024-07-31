import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import ChatIcon from '@mui/icons-material/Chat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAccount } from '../../data/AccountProvider';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { fetchApplications } from '../../data/api';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { updateApplicationStatus } from '../../data/api';

const Applications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);
  const [applications, setApplications] = useState([]);
  const { account, loadingAccount } = useAccount();
  const isOrganization = account?.accountType === 'organization';
  const isVolunteer = account?.accountType === 'volunteer';
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [declineApplicationId, setDeclineApplicationId] = useState(null);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications(account?.id);
        console.log(data);
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!loadingAccount) {
      getApplications();
    }
  }, [loadingAccount, account, isOrganization]);

  const handleChat = (application) => {
    if (isOrganization) {
      navigate('/message', {
        state: {
          toId: application.volunteerId,
          toName: application.volunteerName,
          positionId: application.positionId,
          positionName: application.positionName
        }
      });
    } else {
      navigate('/message', {
        state: {
          toId: application.organizationId,
          toName: application.organizationName,
          positionId: application.positionId,
          positionName: application.positionName
        }
      });
    }
  };

  if (loadingAccount || loading) {
    return <div>loading</div>
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus !== 'declined') {
        await updateApplicationStatus(id, newStatus);
      } else {
        // Open decline dialog
        setDeclineApplicationId(id);
        setDeclineDialogOpen(true);
        console.log('asdfasdf');
        return;
      }
      const updatedData = await fetchApplications(account?.id);
      setApplications(updatedData);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleDeclineConfirm = async () => {
    try {
      await updateApplicationStatus(declineApplicationId, 'declined');
      const updatedData = await fetchApplications(account?.id);
      setApplications(updatedData);
    } catch (error) {
      console.error('Error declining application:', error);
    } finally {
      setDeclineDialogOpen(false);
      setDeclineReason('');
      setDeclineApplicationId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // This will format the date as yyyy/MM/dd
  };

  const columns = [
    {
      field: "rowNumber",
      headerName: "ID",
      flex: 0.5,
      renderCell: (params) => params.api.getRowIndex(params.row.id) + 1
    },
    {
      field: "volunteerName",
      headerName: "Volunteer Name",
      flex: 1,
      renderCell: (params) => (
        <Link to={`/profile/${params.row.volunteerId}`} style={{ color: colors.greenAccent[300], textDecoration: 'none' }}>
          {params.value}
        </Link>
      )
    },
    {
      field: "positionName",
      headerName: "Position Name",
      flex: 1,
      renderCell: (params) => (
        <Link to={`/position-detail/${params.row.positionId}`} style={{ color: colors.greenAccent[300], textDecoration: 'none' }}>
          {params.value}
        </Link>
      )
    },
    {
      field: "applyTime",
      headerName: "Apply Time",
      flex: 1,
      renderCell: (params) => formatDate(params.value)
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        let color, icon, text;

        switch (status) {
          case 'approved':
            color = colors.greenAccent[600];
            icon = <CheckCircleIcon />;
            text = "Approved";
            break;
          case 'declined':
            color = colors.redAccent[600];
            icon = <CloseIcon />;
            text = "Declined";
            break;
          case 'unavailable':
            color = colors.yellowAccent[600];
            icon = <EventBusyIcon />;
            text = "Unavailable";
            break;
          case 'cancelled':
            color = colors.grey[400];
            icon = <CancelIcon />;
            text = "Cancelled";
            break;
          default:
            color = colors.grey[600];
            icon = <HourglassEmptyIcon />;
            text = "Pending";
            break;
        }

        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={color}
            borderRadius="4px"
          >
            {icon}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {text}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   field: "declinedMsg",
    //   headerName: "Declined Message",
    //   flex: 1,
    //   renderCell: ({ row: { declinedMsg, status } }) => {
    //     return status === 'declined' ? declinedMsg : "";
    //   },
    // },
    {
      field: "declinedMsg",
      headerName: "Declined Message",
      flex: 1,
      renderCell: ({ row: { declinedMsg, status } }) => {
        return status === 'declined' ? declinedMsg : '';
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <Tooltip title="message with him/her?">
            <IconButton onClick={() => handleChat(params.row)} size="small">
              <ChatIcon sx={{ color: colors.blueAccent[300] }} />
            </IconButton>
          </Tooltip>
          {
            (isVolunteer && params.row.status === 'pending') && (
              <>
                <Tooltip title="Cancel">
                  <IconButton onClick={() => handleStatusChange(params.row.id, 'cancelled')} size="small">
                    <CancelIcon sx={{ color: colors.redAccent[500] }} />
                  </IconButton>
                </Tooltip>
              </>
            )
          }
          {(isOrganization && params.row.status === 'pending') && (
            <>
              <Tooltip title="Approve">
                <IconButton onClick={() => handleStatusChange(params.row.id, 'approved')} size="small">
                  <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Decline">
                <IconButton onClick={() => handleStatusChange(params.row.id, 'declined')} size="small">
                  <CancelIcon sx={{ color: colors.redAccent[500] }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    }
  ];

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Applications" subtitle={isOrganization ? "Managing Applications" : "Your Applications"} />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${colors.grey[100]} !important`,
              },
            }}
          >
            <DataGrid
              rows={applications}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      </main>
      {/* Decline Reason Dialog */}
      <Dialog open={declineDialogOpen} onClose={() => setDeclineDialogOpen(false)}>
        <DialogTitle>Decline Application</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="declineReason"
            label="Reason for declining"
            type="text"
            fullWidth
            variant="outlined"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeclineConfirm} color="primary">
            Confirm Decline
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Applications;