import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { db, ref, onValue, push, set } from '../../firebase/firebase'; // Import Firebase Realtime Database instance
import { TextField, Button, List, Paper, ListItem, useTheme, ListItemText, Box, Typography } from '@mui/material';
import { useAccount } from '../../data/AccountProvider';
import { useLocation } from 'react-router-dom';
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { styled } from '@mui/material/styles';

const MessageBox = styled(Box)(({ theme, owner }) => ({
  maxWidth: '60%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: owner ? 'green' : 'grey',
  marginBottom: theme.spacing(1),
  marginLeft: owner ? 'auto' : 0,
  wordBreak: 'break-word',
  textAlign: owner ? 'right' : 'left',
}));

const ContactList = styled(Box)(({ theme }) => ({
  width: '30%',
  maxHeight: '65vh',
  overflowY: 'auto',
  padding: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const PrivateMessage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { account, loadingAccount } = useAccount();
  const location = useLocation();
  const { toId, toName, positionId, positionName } = location.state || {};
  const [isSidebar, setIsSidebar] = React.useState(true);
  const [chatId, setChatId] = useState('');

  const isVolunteer = account?.accountType === 'volunteer';
  const fromId = isVolunteer ? account?.volunteerId : account?.organizationId;
  // const fromName = isVolunteer ? account.firstName : account.name;
  useEffect(() => {
    setChatId([fromId, toId].sort().join('_'));
    const messageRef = ref(db, `chats/${chatId}`);
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedMessages = Object.values(data);
        setMessages(fetchedMessages);
      }
    });
    return () => unsubscribe();
  }, [chatId, loadingAccount]);

  console.log(messages)

  if (loadingAccount) {
    return <div>loading account</div>
  }
  if (!toId || !toName) {
    return <div>No message information available</div>;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageRef = ref(db, `chats/${chatId}`);
      const newMessageRef = push(messageRef);
      await set(newMessageRef, {
        text: newMessage,
        sender: fromId,
        receiver: toId,
        timestamp: Date.now(),
        status: 'unread'
      });
      setNewMessage('');
    }
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box sx={{
          padding: '40px'
        }}>
          <Box mb="20px">
            <Typography
              variant="h4"
              color={colors.grey[400]}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              Chat with &nbsp;
              <a
                href={`/profile/${toId}`}
                style={{ textDecoration: 'none', color: colors.greenAccent[400] }}
              >
                {toName}
              </a>&nbsp;
              for&nbsp;
              <a
                href={`/position-detail/${positionId}`}
                style={{ textDecoration: 'none', color: colors.greenAccent[400] }}
              >
                {positionName}
              </a>
            </Typography>
          </Box>
          <Paper
            elevation={3}
            style={{
              padding: '20px',
              height: '65vh',
              backgroundColor: colors.primary,
              overflow: 'auto',
            }}
          >
            <List>
              {messages.map((message, index) => (
                <ListItem key={index} style={{ display: 'flex', justifyContent: message.sender === fromId ? 'flex-end' : 'flex-start' }}>
                  <MessageBox owner={`${message.sender === fromId}`}>
                    <ListItemText
                      primary={message.text}
                      secondary={message.sender === fromId ? 'You' : toName}
                    />
                  </MessageBox>
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', backgroundColor: colors.primary }}>
            <Box display="flex" alignItems="center">
              <TextField
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                sx={{
                  height: '50px',
                  marginRight: '10px'
                }}
              />
              <Button variant="contained" color="primary" onClick={handleSendMessage}
                sx={{
                  height: '50px',
                  backgroundColor: colors.greenAccent[500],
                  color: 'white',
                  '&:hover': {
                    backgroundColor: colors.greenAccent[600],
                  }
                }}>
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </main>
    </div>
  );
};

export default PrivateMessage;
