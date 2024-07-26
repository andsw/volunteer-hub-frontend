import { Box, IconButton, Tooltip, Fab } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { useTheme } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GradeIcon from '@mui/icons-material/Grade';
import PeopleIcon from '@mui/icons-material/People';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState, useEffect } from "react";
import { fetchEvents } from "../../data/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { useAccount } from "../../data/AccountProvider";
import { useParams } from "react-router-dom";

const Events = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account, loadingAccount } = useAccount();
  const navigate = useNavigate(); 
  const { orgId } = useParams();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents(account.organizationId || orgId);
        setEvents(data);
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
    navigate(`/event-detail/${id}`);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked for id:', id);
  };

  const handleAddEvent = () => {
    navigate('/event-form');
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.1, headerAlign: 'center', align: 'center' },
    { field: "title", headerName: "Title", flex: 0.3 },
    { field: "subtitle", headerName: "Subtitle", flex: 0.5 },
    {
      field: "organizationName",
      headerName: "Organization",
      flex: 0.4,
      valueGetter: (params) => params.row.organizationName || 'N/A'
    },
    { field: "venue", headerName: "Venue", flex: 0.75 },
    {
      field: "eventStartTime",
      headerName: "Start Time",
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => format(new Date(params.row.eventStartTime), "yyyy/MM/dd")
    },
    {
      field: "likesNum",
      headerName: "",
      renderHeader: () => <FavoriteIcon />,
      type: "number",
      flex: 0.1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "collectionsNum",
      headerName: "",
      renderHeader: () => <GradeIcon />,
      type: "number",
      flex: 0.1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "reviewsNum",
      headerName: "",
      renderHeader: () => <CommentIcon />,
      type: "number",
      flex: 0.1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "joinedVolunteerNum",
      headerName: "",
      renderHeader: () => <PeopleIcon />,
      type: "number",
      flex: 0.1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: "actions",
      headerName: "",
      renderHeader: () => <SettingsIcon />,
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(params.row.id)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More info">
            <IconButton onClick={() => handleView(params.row.id)} size="small">
              <RemoveRedEyeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row.id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Events" subtitle="List of Events" />
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: colors.greenAccent[300] },
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
              rows={events}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              loading={loading}
            />
          </Box>
          <Fab
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
          </Fab>
        </Box>
      </main>
    </div>
  );
};

export default Events;