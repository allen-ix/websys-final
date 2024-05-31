
import { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Paper, AppBar, Toolbar, Link } from '@material-ui/core';
import useSWR from 'swr';
import axios from 'axios';

const ProfileSchema = Yup.object().shape({
  firstname: Yup.string(),
  email: Yup.string().email('Invalid email'),
  bio: Yup.string(),
});

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ProfileForm = () => {
  const { data, error, mutate } = useSWR('/api/profile', fetcher);
  const [isEditing, setIsEditing] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="employee-form-container">
    <AppBar className="app-bar" position="static">
      <Toolbar className="toolbar" style={{ backgroundColor: '#1976D2', height: '80px' }}>
        <Button variant="text" color='inherit' style={{ margin: '0 10px' }}>
          <Link href="/profile" variant="h5" color="inherit">
            Account
          </Link>
        </Button>
        <Button variant="text" color="inherit" style={{ margin: '0 10px' }}>
          <Link href="/employee-profile" variant="h5" color="inherit">
            Student Profile
          </Link>
        </Button>
        <Button variant="text" color="inherit" style={{ margin: '0 10px' }}>
          <Link href="/" variant="h5" color="inherit">
            Logout
          </Link>
        </Button>
      </Toolbar>
    </AppBar>

      <Container maxWidth="xs" style={{ backgroundColor: '#E1F5FE', paddingTop: 80 }}>
      <Paper style={{ padding: 20, backgroundColor: '#BBDEFB' }}>
        {!isEditing ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Faculty Member
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Name: {data.firstname + ' ' + data.lastname}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Email: {data.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Department: {data.department}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleEdit} style={{ marginTop: 20 }}>
              Edit
            </Button>
          </div>
        ) : (
            <Formik
              initialValues={{
                firstname: data.firstname,
                email: data.email,
                bio: data.bio || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.put('/api/profile', values, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  mutate(); 
                  setIsEditing(false);
                } catch (error) {
                  console.error('Profile update error', error);
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form >
                  <Field
                    as={TextField}
                    name="firstname"
                    label="First Name"
                    fullWidth
                    error={touched.firstname && !!errors.firstname}
                    helperText={touched.firstname && errors.firstname}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="department"
                    label="Department"
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    style={{ marginRight: 10, color:"#1976D2", marginTop: '18px' }}
                    
                  >
                    Save
                  </Button>
                  <Button
                    style={{color: '#1976D2', marginTop: '18px' }}
                    variant="contained"
              
                    onClick={handleEdit}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Paper>
      </Container>
      <footer className="footer1" style={{ backgroundColor: '#1976D2', height: '50px' }}>
        <Typography variant="body1" style={{ margin: '0 10px', marginTop: '545px', textAlign: 'center' }}>
          © {new Date().getFullYear()} PalSU. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default ProfileForm;
