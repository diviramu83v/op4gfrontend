import classNames from 'classnames/bind';
import style from './Loading.module.scss';
const cx = classNames.bind(style);

const Loading = () => {
    return (
        <div className={cx('loading-container')}>
          <div className={cx('ld')}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
    );
};

export default Loading;
