import { Fragment, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import style from './Sidebar.module.scss';
import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import PrintIcon from '@mui/icons-material/Print';
import InsertChartIcon from '@mui/icons-material/InsertChart';
const cx = classNames.bind(style);

const Sidebar = () => {
  return (
    <div className={cx('sidebar')}>
      <Box
        mx='auto'
        alignItems='center'
        className={cx('sidebar-nav')}
      >
        <Link
          href='/login'
          className={cx('nav-link')}
        >
          <Box
            display='flex'
            alignItems='center'
          >
            <Box mr='8px'>
              <PrintIcon />
            </Box>
            Login
          </Box>
        </Link>
        <Link
          href='/supply-requests'
          className={cx('nav-link')}
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
        <Link
          href='/partner-portal'
          className={cx('nav-link')}
        >
          <Box
            display='flex'
            alignItems='center'
          >
            <Box mr='8px'>
              <TextSnippetIcon />
            </Box>
            Partner Portal
          </Box>
        </Link>
        <Link
          href='/new-supply-request'
          className={cx('nav-link')}
        >
          <Box
            display='flex'
            alignItems='center'
          >
            <Box mr='8px'>
              <RecentActorsIcon />
            </Box>
            New supply request
          </Box>
        </Link>

        <Link
          href='/partner-rfq'
          className={cx('nav-link')}
        >
          <Box
            display='flex'
            alignItems='center'
          >
            <Box mr='8px'>
              <InsertChartIcon />
            </Box>
            Create Successfully
          </Box>
        </Link>
      </Box>
    </div>
  );
};

export default Sidebar;
