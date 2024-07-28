import React, { useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { get, db, ref, onValue, push, set, update } from '../../firebase/firebase'; // Import Firebase Realtime Database instance
import { TextField, Button, List, Paper, ListItem, useTheme, ListItemText, Box, Typography } from '@mui/material';
import { useAccount } from '../../data/AccountProvider';
import { useLocation } from 'react-router-dom';
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MessageBox = styled(Box)(({ theme, owner }) => ({
  maxWidth: '60%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: owner === 'true' ? 'green' : 'grey',
  marginBottom: theme.spacing(1),
  marginLeft: owner === 'true' ? 'auto' : 0,
  wordBreak: 'break-word',
  textAlign: owner === 'true' ? 'right' : 'left',
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
  const fromName = isVolunteer ? account?.firstName : account?.name;
  const [unreadCount, setUnreadCount] = useState(0);

  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!fromId) return;

    const chatsRef = ref(db, 'chats');
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const contactsList = [];
        Object.entries(data).forEach(([chatId, messages]) => {
          const lastMessage = Object.values(messages).sort((a, b) => b.timestamp - a.timestamp)[0];
          if (lastMessage.sender === fromId || lastMessage.receiver === fromId) {
            contactsList.push({
              id: lastMessage.sender === fromId ? lastMessage.receiver : lastMessage.sender,
              name: lastMessage.sender === fromId ? lastMessage.receiverName : lastMessage.senderName,
              lastMessage: lastMessage.text,
              timestamp: lastMessage.timestamp,
            });
          }
        });
        setContacts(contactsList);
      }
    });

    return () => unsubscribe();
  }, [fromId]);

  useEffect(() => {
    setChatId((isVolunteer ? [fromId, toId] : [toId, fromId]).sort().join('_'));
    const messageRef = ref(db, `chats/${chatId}`);
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedMessages = Object.values(data);
        setMessages(fetchedMessages);

        // Count unread messages
        const unreadMessages = fetchedMessages.filter(
          msg => msg.receiver === fromId && msg.status === 'unread'
        );
        setUnreadCount(unreadMessages.length);
      }
    });
    return () => unsubscribe();
  }, [chatId, loadingAccount, fromId, fromName]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageRef = ref(db, `chats/${chatId}`);
      const newMessageRef = push(messageRef);
      await set(newMessageRef, {
        text: newMessage,
        sender: fromId,
        senderName: fromName,
        receiver: toId,
        receiverName: toName,
        timestamp: Date.now(),
        status: 'unread'
      });
      setNewMessage('');
    }
  };

  const markMessagesAsRead = async () => {
    const messageRef = ref(db, `chats/${chatId}`);
    const snapshot = await get(messageRef);
    const data = snapshot.val();
    if (data) {
      const updates = {};
      Object.entries(data).forEach(([key, message]) => {
        if (message.receiver === fromId && message.status === 'unread') {
          updates[`${key}/status`] = 'read';
        }
      });
      await update(messageRef, updates);
    }
  };

  useEffect(() => {
    markMessagesAsRead();
  }, [messages]);

  if (loadingAccount) {
    return <div>loading account</div>
  }

  const handleContactClick = (contactId, contactName) => {
    navigate('/message', {
      state: {
        toId: contactId,
        toName: contactName
      }
    });
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content" style={{ flex: 1, overflow: 'auto' }}>
        <Topbar setIsSidebar={setIsSidebar} />
        <Box sx={{ padding: '40px', display: 'flex' }}>
          <ContactList>
            <Typography variant="h6" mb={2}>Contacts</Typography>
            <List>
              {contacts.map((contact) => (
                <ListItem 
                  key={contact.id} 
                  button 
                  onClick={() => handleContactClick(contact.id, contact.name)}
                >
                  <ListItemText 
                    primary={contact.name}
                    secondary={`${contact.lastMessage.substring(0, 20)}...`}
                  />
                  <Typography variant="caption">
                    {format(new Date(contact.timestamp), 'MM/dd/yyyy HH:mm')}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </ContactList>
          {toId && <Box sx={{ flex: 1, marginLeft: '20px' }}>
            <Box mb="20px">
              <Typography
                variant="h4"
                color={colors.grey[400]}
                sx={{ display: 'flex', alignItems: 'center' }}>
                Chat with &nbsp;
                <a
                  href={`/profile/${toId}`}
                  style={{ textDecoration: 'none', color: colors.greenAccent[400] }}
                >
                  {toName}
                </a>&nbsp;
                {positionId && positionName && (
                  <>
                    for&nbsp;
                    <a
                      href={`/position-detail/${positionId}`}
                      style={{ textDecoration: 'none', color: colors.greenAccent[400] }}
                    >
                      {positionName}
                    </a>
                  </>
                )}
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
                {messages.map((message, index) => <ListItem key={index} style={{ display: 'flex', justifyContent: message.sender === fromId ? 'flex-end' : 'flex-start' }}>
                    <MessageBox owner={`${message.sender === fromId}`}>
                      <ListItemText
                        primary={message.text}
                        secondary={
                          <>
                            {message.sender === fromId ? 'You' : message.senderName}
                            <br />
                            {format(new Date(message.timestamp), 'MM/dd/yyyy HH:mm')}
                          </>
                        }
                      />
                    </MessageBox>
                  </ListItem>
                )}
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
          </Box>}
        </Box>
      </main>
    </div>
  );
};


export default PrivateMessage;
