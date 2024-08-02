import { tokens } from "../../theme";
import Header from "../../components/Header";
import Topbar from "../global/Topbar";
import Sidebar from "../global/Sidebar";
import { useTheme, FormControl } from "@mui/material";
import React, { useState } from "react";
import useAuthRedirect from "../../firebase/useAuthRedirect";
import {
  Box, Button, TextField, InputLabel,
  Select, MenuItem, FormHelperText, Typography
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { saveProfile } from "../../data/api";
import { useAuth } from "../../firebase/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import LogoUploader from "../../components/LogoUploader";
import { useAccount } from "../../data/AccountProvider";

const ProfileForm = () => {
  useAuthRedirect();
  const theme = useTheme();
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode);
  const [isSidebar, setIsSidebar] = useState(true);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const authInfo = useAuth();
  const [errorMessage, setErrorMessage] = useState('')
  const { setAccount } = useAccount();
  const location = useLocation(); // Use this to get location state
  const { profile } = location.state || {}; // Extract profile from location state
  // Set initial form values based on profile
  const [initialValues, setInitialValues] = useState({
    accountType: profile?.accountType || "",
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || authInfo.currentUser?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    province: profile?.province || "",
    country: profile?.country || "",
    postcode: profile?.postcode || "",
    dob: profile?.dob || "",
    sex: profile?.sex || "",
    nationality: profile?.nationality || "",
    maritalStatus: profile?.maritalStatus || "",
    occupationStatus: profile?.occupationStatus || "",
    hasDriversLicence: profile?.hasDriversLicence || "",
    skills: profile?.skills || "",
    academicCertificate: profile?.academicCertificate || "",
    resumeLink: profile?.resumeLink || "",
    name: profile?.name || "",
    logoUrl: profile?.logoUrl || "",
    officialSiteLink: profile?.officialSiteLink || "",
  });

  const handleFormSubmit = async (values, { setSubmitting }) => {
    values.avatarImgUrl = authInfo.currentUser.photoURL;
    console.log(values);
    const res = await saveProfile(values);
    console.log(res.data);
    console.log(res.data.success)
    if (res.data.success) {
      setSubmitting(false);
      setAccount(values)
      navigate('/profile')
      setErrorMessage('')
    } else {
      setErrorMessage(res.data.message);
    }
  };

  const handleAccountTypeChange = (event, setFieldValue) => {
    const { value } = event.target;
    setFieldValue('accountType', value);
    // Reset form values when switching account type
    if (value === 'volunteer') {
      setFieldValue('name', '');
      setFieldValue('logoUrl', '');
      setFieldValue('officialSiteLink', '');
      setFieldValue('dob', '');
      setFieldValue('sex', '');
      setFieldValue('nationality', '');
      setFieldValue('maritalStatus', '');
      setFieldValue('occupationStatus', '');
      setFieldValue('hasDriversLicence', '');
      setFieldValue('skills', '');
      setFieldValue('academicCertificate', '');
      setFieldValue('resumeLink', '');
    } else if (value === 'organization') {
      setFieldValue('firstName', '');
      setFieldValue('lastName', '');
      setFieldValue('dob', '');
      setFieldValue('sex', '');
      setFieldValue('nationality', '');
      setFieldValue('maritalStatus', '');
      setFieldValue('occupationStatus', '');
      setFieldValue('hasDriversLicence', false);
      setFieldValue('skills', '');
      setFieldValue('academicCertificate', '');
      setFieldValue('resumeLink', '');
    }
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
          {errorMessage && (
            <span className='error-message'>{errorMessage}</span>
          )}
          {
            !profile &&
            <Typography color={colors.greenAccent[400]} sx={{ mb: 2, fontSize: 25, fontWeight: 'bolder' }}>
              To proceed, please fill out the form below.
            </Typography>
          }

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={yup.object().shape({
              accountType: yup.string().required("required"),
              // Add other validation schemas as needed
            })}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
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
                  <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                    <InputLabel id="accountType-label">You are</InputLabel>
                    <Select
                      labelId="accountType-label"
                      id="accountType"
                      name="accountType"
                      value={values.accountType}
                      disabled={profile != null && profile?.accountType !== ''}
                      onChange={(event) => handleAccountTypeChange(event, setFieldValue)}
                      onBlur={handleBlur}
                      error={!!touched.accountType && !!errors.accountType}
                    >
                      <MenuItem value="volunteer">Volunteer</MenuItem>
                      <MenuItem value="organization">Organization</MenuItem>
                    </Select>
                    {touched.accountType && errors.accountType && (
                      <FormHelperText>{errors.accountType}</FormHelperText>
                    )}
                  </FormControl>
                  {values.accountType === 'volunteer' && (
                    <>
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
                        type="date"
                        label="Date of Birth"
                        InputLabelProps={{ shrink: true }}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.dob}
                        name="dob"
                        error={!!touched.dob && !!errors.dob}
                        helperText={touched.dob && errors.dob}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                        <InputLabel id="sex-label">Sex</InputLabel>
                        <Select
                          labelId="sex-label"
                          id="sex"
                          name="sex"
                          value={values.sex}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.sex && !!errors.sex}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {touched.sex && errors.sex && <FormHelperText>{errors.sex}</FormHelperText>}
                      </FormControl>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Nationality"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.nationality}
                        name="nationality"
                        error={!!touched.nationality && !!errors.nationality}
                        helperText={touched.nationality && errors.nationality}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                        <InputLabel id="maritalStatus-label">Marital Status</InputLabel>
                        <Select
                          labelId="maritalStatus-label"
                          id="maritalStatus"
                          name="maritalStatus"
                          value={values.maritalStatus}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.maritalStatus && !!errors.maritalStatus}
                        >
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="married">Married</MenuItem>
                          <MenuItem value="divorced">Divorced</MenuItem>
                          <MenuItem value="widowed">Widowed</MenuItem>
                        </Select>
                        {touched.maritalStatus && errors.maritalStatus && <FormHelperText>{errors.maritalStatus}</FormHelperText>}
                      </FormControl>
                      <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                        <InputLabel id="occupationStatus-label">Occupation Status</InputLabel>
                        <Select
                          labelId="occupationStatus-label"
                          id="occupationStatus"
                          name="occupationStatus"
                          value={values.occupationStatus}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.occupationStatus && !!errors.occupationStatus}
                        >
                          <MenuItem value="employed">Employed</MenuItem>
                          <MenuItem value="unemployed">Unemployed</MenuItem>
                          <MenuItem value="student">Student</MenuItem>
                        </Select>
                        {touched.occupationStatus && errors.occupationStatus && <FormHelperText>{errors.occupationStatus}</FormHelperText>}
                      </FormControl>
                      <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                        <InputLabel id="has_drivers_licence-label">Driver's License</InputLabel>
                        <Select
                          labelId="has_drivers_licence-label"
                          id="hasDriversLicence"
                          name="hasDriversLicence"
                          value={values.hasDriversLicence}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.hasDriversLicence && !!errors.hasDriversLicence}
                        >
                          <MenuItem value="true" >Yes</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Select>
                        {touched.hasDriversLicence && errors.hasDriversLicence && <FormHelperText>{errors.hasDriversLicence}</FormHelperText>}
                      </FormControl>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Skills"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.skills}
                        name="skills"
                        error={!!touched.skills && !!errors.skills}
                        helperText={touched.skills && errors.skills}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Academic Certificate"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.academicCertificate}
                        name="academicCertificate"
                        error={!!touched.academicCertificate && !!errors.academicCertificate}
                        helperText={touched.academicCertificate && errors.academicCertificate}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Resume Link"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.resumeLink}
                        name="resumeLink"
                        error={!!touched.resumeLink && !!errors.resumeLink}
                        helperText={touched.resumeLink && errors.resumeLink}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </>
                  )}

                  {values.accountType === 'organization' && (
                    <>
                      <LogoUploader />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.name}
                        name="name"
                        error={!!touched.name && !!errors.name}
                        helperText={touched.name && errors.name}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Official website"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.officialSiteLink}
                        name="officialSiteLink"
                        error={!!touched.officialSiteLink && !!errors.officialSiteLink}
                        helperText={touched.officialSiteLink && errors.officialSiteLink}
                        sx={{ gridColumn: "span 2" }}
                      />
                    </>
                  )}

                  <TextField
                    fullWidth
                    variant="filled"
                    type="email"
                    label="Email"
                    disabled={values.email !== ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.address}
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
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Province/State"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.province}
                    name="province"
                    error={!!touched.province && !!errors.province}
                    helperText={touched.province && errors.province}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Country"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.country}
                    name="country"
                    error={!!touched.country && !!errors.country}
                    helperText={touched.country && errors.country}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Postcode/Zipcode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.postcode}
                    name="postcode"
                    error={!!touched.postcode && !!errors.postcode}
                    helperText={touched.postcode && errors.postcode}
                    sx={{ gridColumn: "span 2" }}
                  />

                  <Button type="submit" color="secondary" variant="contained">
                    Save Profile
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

export default ProfileForm;
