import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { useTheme, FormControl } from "@mui/material";
import React, { useState } from "react";
import useAuthRedirect from "../../firebase/useAuthRedirect";
import {
  Box, Button, TextField, InputLabel,
  Select, MenuItem, FormHelperText, Typography, Divider
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useAccount } from "../../data/AccountProvider";
import useMediaQuery from "@mui/material/useMediaQuery";

const Profile = () => {
  useAuthRedirect();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const { accountTypeIsNotEmpty} = useAccount();
  const [errorMessage] = useState(accountTypeIsNotEmpty ?
    '' : 'To proceed, please provide the missing information in your profile!');

  const handleAccountTypeChange = (event, handleChange) => {
    const { name, value } = event.target;

    // Example: Log the change to the console
    console.log(`Field ${name} changed to ${value}`);

    // Call Formik's default handleChange
    handleChange(event);
  };

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box m="20px">
          <Header
            title="Profile"
            subtitle="Detailed Account Information"
          />
          <Typography color={colors.greenAccent[400]} sx={{ mb: 2, fontSize: 20 }}>
            {errorMessage}
          </Typography>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                    <InputLabel id="accountType-label">You are</InputLabel>
                    <Select
                      labelId="accountType-label"
                      id="accountType"
                      name="accountType"
                      value={values.accountType}
                      onChange={(event) => handleAccountTypeChange(event, handleChange)}
                      onBlur={handleBlur}
                      error={!!touched.accountType && !!errors.accountType}
                      displayEmpty
                    >
                      <MenuItem value="volunteer">Volunteer</MenuItem>
                      <MenuItem value="organization">Organization</MenuItem>
                    </Select>
                    {touched.accountType && errors.accountType && (
                      <FormHelperText>{errors.accountType}</FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Contact Number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contact}
                    name="contact"
                    error={!!touched.contact && !!errors.contact}
                    helperText={touched.contact && errors.contact}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address1}
                    name="address"
                    error={!!touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="City"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    name="city"
                    error={!!touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Province"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.province}
                    name="province"
                    error={!!touched.province && !!errors.province}
                    helperText={touched.province && errors.province}
                    sx={{ gridColumn: "span 1" }}
                  />
                </Box>
                {
                  accountTypeIsNotEmpty &&
                  <Box>
                    <Divider variant="middle" component="li" />
                  </Box>
                }

                <Box display="flex" justifyContent="end" mt="20px">
                  <Button type="submit" color="secondary" variant="contained">
                    Save profile
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </main>
    </div>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
  accountType: yup.string()
    .oneOf(['volunteer', 'organization', 'admin'], 'Invalid account type')
    .required('required'),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
  accountType: ""
};

export default Profile;