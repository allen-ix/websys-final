
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Typography, Container, Paper, AppBar, Toolbar, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core';
import { Search, Edit, Delete, Add } from '@material-ui/icons';
import useSWR, { mutate } from 'swr';
import axios from 'axios';


interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  position: string;
  bio: string;
}

const EmployeeSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  position: Yup.string().required('Position is required'),
  bio: Yup.string(),
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const EmployeeProfileForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, error } = useSWR<Employee[]>(`/api/employee-profile?search=${searchQuery}`, fetcher);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleEdit = (id: number) => {
    setIsEditing(id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/employee-profile?id=${id}`);
      mutate(`/api/employee-profile?search=${searchQuery}`);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(null);
  };

  return (
    <div className="employee-form-container">
      <AppBar className="app-bar" position="static">
        <Toolbar className="toolbar" style={{ backgroundColor: '#4EA685', height: '80px' }}>
          <Typography variant="h5" className="title">
            Employee Management
          </Typography>
          <Link href="/profile" variant="h5" className="link1" style={{ margin: '0 10px', marginLeft: '1200px', color: '#fff' }}>
            Profile
          </Link>
          <Link href="/employee-profile" variant="h5" className="link1" style={{ margin: '0 10px', color: '#fff'  }}>
            Employee Profile
          </Link>
          <Link href="/" variant="h5" className="link1" style={{ margin: '0 10px', color: '#fff'  }}>
            Logout
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: 50, backgroundColor: '#8e8e8e' }}>
        <Paper className="paper" style={{backgroundColor: '#c0c0c0' }}>
          <Typography variant="h4" className="form-title" gutterBottom>
            Employee Profiles
          </Typography>
          <TextField style={{ width: '1200px', marginLeft:'18px', outlineColor: '#fff' }}
            className="search-field"
            label="Search by name or position"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            startIcon={<Add />}
            style={{ marginTop: -230, backgroundColor: '#4ea685', color: '#fff', marginLeft: 1100 }}
            onClick={() => setOpen(true)}
          >
            Add New
          </Button>
          <TableContainer className="table-container" component={Paper} style={{backgroundColor: '#c0c0c0' }} >
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Bio</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((employee: Employee, index: number) => (
                  <TableRow key={employee.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${employee.firstname} ${employee.lastname}`}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.bio}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(employee.id)}>
                          <Edit style={{ color: '#4ea685' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(employee.id)}>
                          <Delete style={{ color: '#4ea685' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
  
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="dialog-title">{isEditing === null ? 'Add New Employee' : 'Edit Employee'}</DialogTitle>
            <DialogContent className="dialog-content">
              <Formik
                initialValues={
                  isEditing === null
                    ? { firstname: '', lastname: '', email: '', position: '', bio: '' }
                    : data.find(emp => emp.id === isEditing) || { firstname: '', lastname: '', email: '', position: '', bio: '' }
                }
                validationSchema={EmployeeSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    if (isEditing === null) {
                      await axios.post('/api/employee-profile', values);
                    } else {
                      await axios.put(`/api/employee-profile?id=${isEditing}`, values);
                    }
                    mutate(`/api/employee-profile?search=${searchQuery}`); 
                    handleClose();
                    resetForm();
                    setSubmitting(false);
                  } catch (err) {
                    console.error('Submit error', err);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Field
                      as={TextField}
                      name="firstname"
                      label="First Name"
                      fullWidth
                      error={touched.firstname && !!errors.firstname}
                      helperText={touched.firstname && errors.firstname}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="lastname"
                      label="Last Name"
                      fullWidth
                      error={touched.lastname && !!errors.lastname}
                      helperText={touched.lastname && errors.lastname}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="position"
                      label="Position"
                      fullWidth
                      error={touched.position && !!errors.position}
                      helperText={touched.position && errors.position}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="bio"
                      label="Bio"
                      fullWidth
                      multiline
                      rows={4}
                      style={{ marginBottom: 20 }}
                    />
                    <DialogActions>
                      <Button
                        style={{backgroundColor: '#4EA685'}}
                        className="submit-button"
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        style={{backgroundColor: '#4EA685'}}
                        className="cancel-button"
                        variant="contained"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </Paper>
      </Container>
      <footer className="footer1" style={{ backgroundColor: '#4EA685', height: '50px' }}>
        <Typography variant="body1" style={{ margin: '0 10px', marginTop: '540px', textAlign: 'center' }}>
          © {new Date().getFullYear()} LorenzLucio. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default EmployeeProfileForm;
