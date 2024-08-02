import { Box, useTheme } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header title="FAQ" subtitle="Frequently Asked Questions About Our Volunteer Management System" />
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How do I sign up as a volunteer?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                To sign up as a volunteer, click on the "Register" button on the homepage and fill out the registration form. You'll need to provide some basic information and select your areas of interest for volunteering.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How can organizations post volunteer opportunities?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Organizations can post volunteer opportunities by logging into their account, navigating to the "Create Event" page, and filling out the event details form. Once submitted, the opportunity will be visible to potential volunteers.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How do I search for volunteer opportunities?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can search for volunteer opportunities by using the search function on the homepage. You can filter opportunities by location, date, type of work, and organization. Click on any opportunity to view more details and sign up.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                Can I track my volunteer hours?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, you can track your volunteer hours through your volunteer dashboard. After completing a volunteer opportunity, you can log your hours, which will be verified by the organization. You can view your total hours and download a report of your volunteer activities.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                How do I contact an organization about a volunteer opportunity?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                When viewing a volunteer opportunity, you'll see a "Contact Organization" button. Clicking this will open a message form where you can send your questions directly to the organization. You can also find the organization's contact information on their profile page.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </main>
    </div>
  );
};

export default FAQ;