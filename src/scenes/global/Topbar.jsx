import React, {useContext } from 'react';
import { useState } from 'react';
import { Box, IconButton, useTheme, InputBase, Menu, MenuItem } from '@mui/material';
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth';
import NotificationIcon from '../../components/NotificationIcon';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const handleResetPasswd = () => {
    console.log("handleResetPasswd clicked");
    handleClose();
  };

  const handleLogout = async () => {
    await doSignOut();
    handleClose();
    navigate('/login');
  };

  const open = Boolean(anchorEl);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <NotificationIcon />
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleClick}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
      {/* Menu for Profile and Logout */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 10px rgba(0, 0, 0, 0.2))',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              fontSize: '14px',
              padding: '10px 20px',
            },
          },
        }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleResetPasswd}>Reset Password</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Topbar;