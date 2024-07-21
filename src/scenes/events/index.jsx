import { Box, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
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
import axios from "axios";
import { format } from "date-fns";

const Events = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_HOST}/event/backend`);
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching Events:", error);
    }
  };

  const handleEdit = (id) => {
    // Empty method for edit action
    console.log('Edit clicked for id:', id);
  };
  
  const handleView = (id) => {
    // Empty method for view action
    console.log('View clicked for id:', id);
  };
  
  const handleDelete = (id) => {
    // Empty method for delete action
    console.log('Delete clicked for id:', id);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.1, headerAlign: 'center', align: 'center',},
    { field: "title", headerName: "Title", flex: 0.3 },
    { field: "subtitle", headerName: "Subtitle", flex: 0.5 },
    // { field: "requiredSkillTags", headerName: "Required Skills", flex: 1 },
    { field: "organizationName", headerName: "Organization", flex: 0.4, 
      valueGetter: (params) => {
        return `${params.row.organizationName}`
      }
    },
    { field: "venue", headerName: "Venue", flex: 0.75 },
    { field: "eventStartTime", headerName: "Start Time", flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => {
        // Convert the ISO string to a more readable format
        const date = new Date(params.row.eventStartTime);
        return format(date, "yyyy/MM/dd");
      }
     },
    // { field: "eventEndTime", headerName: "End Time", flex: 0.55,
    //   valueGetter: (params) => {
    //     // Convert the ISO string to a more readable format
    //     const date = new Date(params.row.eventStartTime);
    //     return format(date, "yyyy/MM/dd");
    //   }
    // },
    { field: "likesNum", 
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <FavoriteIcon/>
      ), type: "number", flex: 0.1 },
    { field: "collectionsNum", 
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <GradeIcon/>
      ), type: "number", flex: 0.1 },
    { field: "reviewsNum", 
      align: 'center',
      headerAlign: 'center',
      renderHeader: () => (
        <CommentIcon/>
      ), type: "number", flex: 0.1 },
    { field: "joinedVolunteerNum", 
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <PeopleIcon/>
      ), type: "number", flex: 0.1 },
    {
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <SettingsIcon/>
      ),
      flex: 0.2,
      renderCell: (params) => {
        return (
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
        )
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Events"
        subtitle="List of Events"
      />
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
          rows={events}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Events;
