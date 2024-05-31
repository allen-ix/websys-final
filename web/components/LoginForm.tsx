

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

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post('/api/login', values);
          localStorage.setItem('token', response.data.token);
          router.push('/profile');
        } catch (error) {
          console.error('Login error', error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box mb={2}>
            <Field
              as={TextField}
              name="username"
              label="User name"
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
            disabled={isSubmitting}
            style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;

