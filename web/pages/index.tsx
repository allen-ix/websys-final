import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@material-ui/core';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadows[5],
    maxWidth: 400,
    width: '100%',
  },
  form: {
    padding: theme.spacing(4),
  },
  tabContent: {
    padding: theme.spacing(2),
  },
  tab: {
    backgroundColor: '#1976D2',
    color: 'white',
    '&.Mui-selected': {
      backgroundColor: '#115293', 
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box className={classes.container}>
      <Paper className={classes.formWrapper}>
        <Box className={classes.form}>
          <Tabs value={tabIndex} onChange={handleChange} centered>
            <Tab label="Login" className={classes.tab} />
            <Tab label="Signup" className={classes.tab} />
          </Tabs>
          <Box className={classes.tabContent}>
            {tabIndex === 0 && <LoginForm />}
            {tabIndex === 1 && <SignupForm />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
