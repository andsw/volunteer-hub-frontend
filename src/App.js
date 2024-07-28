import { Routes, Route } from "react-router-dom";
import Positions from "./scenes/positions";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import FAQ from "./scenes/faq";
import ProfileForm from "./scenes/profileForm";
import Events from "./scenes/events";
import EventDetail from "./scenes/eventDetail";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { AuthProvider } from "./firebase/authContext";
import { AccountProvider } from "./data/AccountProvider";
import Profile from "./scenes/profile";
import EventForm from "./scenes/eventForm";
import PositionForm from "./scenes/positionForm";
import PositionDetail from "./scenes/positionDetail";
import Home from "./scenes/home";
import PrivateMessage from "./scenes/privateMessage";
import About from "./scenes/about";
import ContactUs from "./scenes/contactUs";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AccountProvider>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/events/:id?" element={<Events />} />
              <Route path="/event-detail/:id" element={<EventDetail />} />
              <Route path="/event-form" element={<EventForm />} />
              <Route path="/position" element={<Positions />} />
              <Route path="/position-detail/:id" element={<PositionDetail />} />
              <Route path="/position-form" element={<PositionForm />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/profile/:id?" element={<Profile />} />
              <Route path="/profile-form" element={<ProfileForm />} />
              <Route path="/message" element={<PrivateMessage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactUs/>}/>
            </Routes>
          </AccountProvider>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
