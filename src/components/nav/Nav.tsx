import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import classNames from 'classnames/bind';
import style from './Nav.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HeaderUserbox from './../userbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PrintIcon from '@mui/icons-material/Print';
import FolderIcon from '@mui/icons-material/Folder';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const cx = classNames.bind(style);
const navItems = ['Projects', 'Reports', 'Vendors', 'Supply Requests', 'Feasibility'];

const Nav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box className={cx('nav')}>
        <Box
          display='flex'
          mx='auto'
          alignItems='center'
          p='10px'
        >
          <Box mr='auto'>
            <Link
              href='/'
              className={cx('link')}
            >
              <div className={cx('title-logo')}>
                <div>
                  <Image
                    alt='Logo'
                    width='60'
                    src={require('../../../public/op4g-logo-white.svg')}
                  />
                </div>
                <p>Manifest</p>
              </div>
            </Link>
          </Box>
          <div className={cx('sm-d-none')}>
            <Box
              mx='auto'
              alignItems='center'
            >
              <List style={{ display: 'flex', color: 'white' }}>
                {navItems.map(item => (
                  <ListItem
                    key={item}
                    style={{ width: 'auto' }}
                    disablePadding

                  >
                    <ListItemButton sx={{ textAlign: 'center' }} >
                      {item != 'Supply Requests' ? (
                        <ListItemText primary={item} />) : (<ListItemText onClick={(event) => handleClick(event)}
                          primary={<span>{item}<ArrowDropDownIcon style={{ verticalAlign: 'middle' }} /></span>}
                        />)}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
          <Box
            ml='auto'
            mr='20px'
            display='flex'
            className={cx('nav-buttons')}
          >
            <Link href='/supply-requests'>
              <Button
                variant='outlined'
                className={cx('btn', 'outline')}
              >
                <Box
                  display='flex'
                  alignItems='center'
                >
                  <AddIcon color='success' />
                  Project
                </Box>
              </Button>
            </Link>
            <Link href='#'>
              <Button className={cx('btn')}>
                <Box
                  display='flex'
                  alignItems='center'
                >
                  <AddIcon color='success' />
                  Feasibility
                </Box>
              </Button>
            </Link>
          </Box>
          <HeaderUserbox />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            PaperProps={{
              style: {
                background: "#274C77",
                boxShadow: "none",
                marginTop: '24px',
                marginLeft: '-20px'
              }
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link
                href='/supply-requests'
                className={cx('nav-link')}
                onClick={handleClose}
              >
                <Box
                  display='flex'
                  alignItems='center'
                >
                  <Box mr='8px'>
                    <FolderIcon />
                  </Box>
                  Supply Requests
                </Box>

              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                href='/partner-portal'
                className={cx('nav-link')}
                onClick={handleClose}
              >
                <Box
                  display='flex'
                  alignItems='center'
                >
                  <Box mr='8px'>
                    <TextSnippetIcon />
                  </Box>
                  Partner portal
                </Box>

              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link
                href='/new-supply-request'
                className={cx('nav-link')}
                onClick={handleClose}
              >
                <Box
                  display='flex'
                  alignItems='center'
                >
                  <Box mr='8px'>
                    <RecentActorsIcon />
                  </Box>
                  New Supply Request
                </Box>

              </Link>
            </MenuItem>
            
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default Nav;
