import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Divider, Hidden, Popover, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import style from './Userbox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        align-items: center;
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function HeaderUserbox() {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      setName(userData.first_name + ' ' + userData.last_name);
    }
  }, []);

  const user = {
    name: name,
    avatar:
      'https://flatlogic.github.io/react-material-admin-full/static/media/main-profile.d767941b.png',
    jobtitle: 'Project Manager'
  };
  const router = useRouter();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const signOut = () => {
    localStorage.setItem('loggedIn', 'false')
    router.push('/login');
  };

  return (
    <>
      <UserBoxButton
        className={cx('header-user')}
        color='secondary'
        ref={ref}
        onClick={handleOpen}
      >
        <Avatar
          alt={user.name}
          src={user.avatar}
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel>{user.name}</UserBoxLabel>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        className={cx('popover-user')}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{ minWidth: 210 }}
          display='flex'
        >
          <Avatar
            alt={user.name}
            src={user.avatar}
          />
          <UserBoxText>
            <UserBoxLabel>{user.name}</UserBoxLabel>
          </UserBoxText>
        </MenuUserBox>

        <Divider />
        <Box sx={{ m: 1 }}>
          <Button
            color='primary'
            fullWidth
            onClick={() => signOut()}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
