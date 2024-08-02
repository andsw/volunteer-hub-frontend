import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import './style.css'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useAccount } from '../../data/AccountProvider';
import { fetchJoinedEvents } from '../../data/api';
import { fetchEvents } from '../../data/api';

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [events, setEvents] = useState([]);
  const [isSidebar, setIsSidebar] = useState(true);
  const { account, loadingAccount } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let data;
      try {
        if (account?.accountType === 'volunteer') {
          data = (await fetchJoinedEvents(account.volunteerId)).map(event => ({
            id: event.id,
            title: event.title,
            start: event.eventStartTime,
            end: event.eventEndTime,
            extendedProps: {
              subtitle: event.subtitle,
              requiredSkillTags: event.requiredSkillTags,
              organizationId: event.organizationId,
              organizationName: event.organizationName,
              venue: event.venue,
              lastEditTime: event.lastEditTime,
              createTime: event.createTime,
              likesNum: event.likesNum,
              collectionsNum: event.collectionsNum,
              reviewsNum: event.reviewsNum,
              joinedVolunteerNum: event.joinedVolunteerNum
            }
          }));
        } else if (account?.accountType === 'organization') {
          data = (await fetchEvents(account.organizationId)).map(event => ({
            id: event.id,
            title: event.title,
            start: event.eventStartTime,
            end: event.eventEndTime,
            extendedProps: {
              subtitle: event.subtitle,
              requiredSkillTags: event.requiredSkillTags,
              organizationId: event.organizationId,
              organizationName: event.organizationName,
              venue: event.venue,
              lastEditTime: event.lastEditTime,
              createTime: event.createTime,
              likesNum: event.likesNum,
              collectionsNum: event.collectionsNum,
              reviewsNum: event.reviewsNum,
              joinedVolunteerNum: event.joinedVolunteerNum
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setEvents(data);
    };

    if (!loadingAccount) {
      fetchData();
    }
  }, [account, loadingAccount]);

  if (loadingAccount) {
    return <div>loading</div>
  }

  const handleEventClick = (clickInfo) => {
    navigate(`/event-detail/${clickInfo.event.id}`, { state: { eventDetails: clickInfo.event.extendedProps } });
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
          <Box display="flex" justifyContent="space-between">
            {/* CALENDAR SIDEBAR */}
            <Box
              flex="1 1 20%"
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
            >
              <Typography variant="h5">Upcoming Events</Typography>
              <List>
                {events?.slice(0, 5).map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Typography>
                          {new Date(event.start).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* CALENDAR */}
            <Box flex="1 1 100%" ml="15px">
              <FullCalendar
                height="75vh"
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                eventClick={handleEventClick}
                events={events}
                eventClassNames="pointer" 
              />
            </Box>
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default Calendar;