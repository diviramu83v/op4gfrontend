import React from "react";

import classNames from 'classnames/bind';
import style from './boundLoading.module.scss';

const cx = classNames.bind(style);

const BouncingDotsLoader = () => {
  return (
    <>
      <div className={cx('bouncing-loader')}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default BouncingDotsLoader;
