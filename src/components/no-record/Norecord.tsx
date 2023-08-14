import classNames from 'classnames/bind';
import Image from 'next/image';
import style from './Norecord.module.scss';
const cx = classNames.bind(style);

const NoRecord = () => {
  return (
    <div className={cx('container')}>
      <div>
        <Image
          alt='Logo'
          width='160'
          src={require('../../../public/images/404-icon.svg')}
        />
      </div>
      <p>No records found</p>
    </div>
  );
};

export default NoRecord;
