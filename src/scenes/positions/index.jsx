import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Tooltip, IconButton, Fab } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";
import Sidebar from "../global/Sidebar";
import Topbar from "../global/Topbar";
import { Add } from "@mui/icons-material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { useAccount } from '../../data/AccountProvider';
import { fetchPositions } from '../../data/api';
import { Link, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';


const Positions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);
  const [positions, setPositions] = useState([]);
  const {account, loadingAccount} = useAccount();
  const isVolunteer = account?.accountType === 'volunteer'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchPositions(account?.organizationId);
        setPositions(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!loadingAccount) {
      getEvents();
    }
  }, [loadingAccount]);

  const handleEdit = (id) => {
    navigate(`/event-form/${id}`);
  };

  const handleView = (id) => {
    navigate(`/position-detail/${id}`);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked for id:', id);
  };

  const handleAddEvent = () => {
    navigate('/event-form');
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Position Name",
      flex: 1,
      cellClassName: "name-column--cell"
    },
    {
      field: "eventName",
      headerName: "Event Name",
      flex: 1,
      renderCell: ({ row: { eventId, eventName } }) => {
        return (
          <Box display="flex" alignItems="center">
            <CalendarTodayOutlinedIcon sx={{ mr: "5px" }} />
            <Link to={`/event-detail/${eventId}`} style={{ textDecoration: 'none', color: colors.grey[100] }}>
              {eventName}
            </Link>
          </Box>
        );
      },
    },
    {
      field: "organizationName",
      headerName: "Organization",
      flex: 1,
      renderCell: ({ row: { organizationId, organizationName } }) => {
        return (
          <Box display="flex" alignItems="center">
            <BusinessOutlinedIcon sx={{ mr: "5px" }} />
            <Link to={`/events/${organizationId}`} style={{ textDecoration: 'none', color: colors.grey[100] }}>
              {organizationName}
            </Link>
          </Box>
        );
      },
    },
    {
      field: "availableSpots",
      headerName: "Available Spots",
      type: "number",
      headerAlign: "left",
      align: "left",
      renderCell: ({ row: { recruitmentNum, recruitedNum } }) => {
        const availableSpots = recruitmentNum - recruitedNum;
        return (
          <Box
            width="90%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              availableSpots > 0
                ? colors.greenAccent[600]
                : colors.redAccent[600]
            }
            borderRadius="4px"
          >
            <PersonOutlinedIcon />
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {recruitedNum || 0} / {recruitmentNum}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      renderHeader: () => <SettingsIcon />,
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box>
          {!isVolunteer && <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>}
          <Tooltip title="More info">
            <IconButton onClick={() => handleView(params.row.id)} size="small">
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
          {!isVolunteer && <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>}
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
          <Header title="Positions" subtitle="Managing the Volunteer Positions" />
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
              rows={positions}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>
          {!isVolunteer && <Fab
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
            onClick={handleAddEvent}
          >
            <Add />
          </Fab>}
        </Box>
      </main>
    </div>
  );
};

export default Positions;