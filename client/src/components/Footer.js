import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const Links = () => (
    <Typography variant='body2' color='textSecondary' align='center'>
      <Link target='_blank' color='inherit' href='https://github.com/jshafto/poemlapse'>
        Github
      </Link>{' | '}
      <Link target='_blank' color='inherit' href='https://github.com/jshafto/'>
        Portfolio
      </Link>{' | '}
      <Link target='_blank' color='inherit' href='https://midst.press'>
        Inspired by Midst
      </Link>

    </Typography>
);


const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  }
}));

 const Footer = () => {
  const classes = useStyles();

  return (
      <footer className={classes.footer}>
        <Container maxWidth='sm'>
          {/* <Typography variant='body1' align='center'>My sticky footer can be found here.</Typography> */}
          <Links />
        </Container>
      </footer>
  );
}

export default Footer;
