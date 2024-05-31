import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@material-ui/core';
import axios from 'axios';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#4EA685',
    '&:hover': {
      backgroundColor: '#4EA685',
    },
  },
}));

const SignupSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  username: Yup.string().required('User name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignupForm = () => {
  const router = useRouter();
  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <Formik
      initialValues={{ firstname: '', lastname: '', username: '', email: '', password: '' }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log('Form values:', values);
        try {
          await axios.post('/api/signup', values);
          setIsSuccess(true);
        } catch (error) {
          console.error('Signup error', error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box mb={2}>
            <Field
              as={TextField}
              name="firstname"
              label="First Name"
              fullWidth
              error={touched.firstname && !!errors.firstname}
              helperText={touched.firstname && errors.firstname}
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="lastname"
              label="Last Name"
              fullWidth
              error={touched.lastname && !!errors.lastname}
              helperText={touched.lastname && errors.lastname}
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="username"
              label="User Name"
              fullWidth
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="email"
              label="Email"
              fullWidth
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
          </Box>
          <Box mb={2}>
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              fullWidth
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={classes.button}
            disabled={isSubmitting || isSuccess}
            style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}
          >
            {isSuccess ? 'Signup Successfull!' : 'Signup'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
