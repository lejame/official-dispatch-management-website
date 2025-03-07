import { FireFilled } from '@ant-design/icons';
import styles from './sidenav.module.scss';

export const Logo = () => {
    return (
        <div className={styles.logo}>
            <div className={styles.logoIcon}>
                <FireFilled></FireFilled>
            </div>
        </div>
    );
};
