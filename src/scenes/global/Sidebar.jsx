import { useState } from "react";
import { useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from "../../firebase/authContext";
import { useAccount } from "../../data/AccountProvider";
import useAuthRedirect from "../../firebase/useAuthRedirect";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate, useLocation } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  useAuthRedirect();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const currentUser = useAuth();
  const { account, loadingAccount } = useAccount();
  const accountTypeIsNotEmpty = account?.accountType != null;
  const userIsOrganization = account?.accountType === 'organization';
  const userIsVolunteer = account?.accountType === 'volunteer';
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {
    if (!loadingAccount && currentPath !== '/profile-form' && !accountTypeIsNotEmpty) {
      navigate('/profile-form');
    }
  }, [loadingAccount, accountTypeIsNotEmpty, currentPath, navigate]);
  if (loadingAccount) {
    <div>loading...</div>
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {!accountTypeIsNotEmpty ? 'Welcome!' : account.accountType}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={account?.logoUrl || (currentUser.currentUser && currentUser.currentUser.photoURL) || `../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {
                    (userIsOrganization && account?.name) || (userIsVolunteer && account?.firstName)
                    || (currentUser.currentUser && currentUser.currentUser.displayName)
                  }
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {currentUser.currentUser.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Homepage"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {
              accountTypeIsNotEmpty &&
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Data
              </Typography>
            }
            {accountTypeIsNotEmpty &&
              <Item
                title="Events"
                to="/events"
                icon={<VolunteerActivismIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            {
              accountTypeIsNotEmpty && <Item
                title="Positions"
                to="/positions"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            {
              accountTypeIsNotEmpty &&
              <Item
                title="applications"
                to="/applications"
                icon={<MoveToInboxIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            {
              accountTypeIsNotEmpty &&
              <Item
                title="chat"
                to="/message"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            {/* {
              (userIsAdmin || userIsOrganization) &&
              <Item
                title="Invoices Balances"
                to="/invoices"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            } */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            {
              <Item
                title="Profile"
                to="/profile"
                icon={<PersonOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            {
              accountTypeIsNotEmpty &&
              <Item
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            }
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
