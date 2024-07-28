import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { db, ref, onValue, get, update} from '../firebase/firebase';
import { useAccount } from '../data/AccountProvider';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { account } = useAccount();
    const navigate = useNavigate();
  
    const userId = account?.accountType === 'volunteer' ? account?.volunteerId : account?.organizationId;
  
    useEffect(() => {
      if (!userId) return;
  
      const chatsRef = ref(db, 'chats');
      const unsubscribe = onValue(chatsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          let count = 0;
          const newNotifications = [];
          Object.entries(data).forEach(([chatId, messages]) => {
            const unreadMessages = Object.values(messages).filter(
              msg => msg.receiver === userId && msg.status === 'unread'
            );
            count += unreadMessages.length;
            if (unreadMessages.length > 0) {
              newNotifications.push({
                chatId,
                sender: unreadMessages[0].sender,
                senderName: unreadMessages[0].senderName,
                count: unreadMessages.length
              });
            }
          });
          setUnreadCount(count);
          setNotifications(newNotifications);
        }
      });
  
      return () => unsubscribe();
    }, [userId]);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleNotificationClick = async (notification) => {
      // Mark messages as read
      const chatRef = ref(db, `chats/${notification.chatId}`);
      const snapshot = await get(chatRef);
      const data = snapshot.val();
      if (data) {
        const updates = {};
        Object.entries(data).forEach(([key, message]) => {
          if (message.receiver === userId && message.status === 'unread') {
            updates[`${key}/status`] = 'read';
          }
        });
        await update(chatRef, updates);
      }
  
      // Navigate to the message page
      navigate('/message', { 
        state: { 
          toId: notification.sender, 
          toName: notification.senderName, 
          positionId: '', // You might want to pass this information if available
          positionName: '' // You might want to pass this information if available
        } 
      });
      handleClose();
    };
  
    return (
      <>
        <IconButton onClick={handleClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {notifications.length === 0 ? (
            <MenuItem>No new messages</MenuItem>
          ) : (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={() => handleNotificationClick(notification)}>
                <Typography>
                  {notification.senderName} sent {notification.count} new message(s)
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>
      </>
    );
  };
  
  export default NotificationIcon;