import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { Button } from 'antd';
import styles from './toggle.module.scss';
interface ToggleThemeButtonProps {
    darkTheme: boolean;
    toggleTheme: () => void;
}

const ToggleThemeButton: React.FC<ToggleThemeButtonProps> = ({ darkTheme, toggleTheme }) => {
    return (
        <div className={styles['toggle-theme-btn']}>
            <Button onClick={toggleTheme}>
                {darkTheme ? <HiOutlineMoon size={20} /> : <HiOutlineSun size={20} />}
            </Button>
        </div>
    );
};

export default ToggleThemeButton;
