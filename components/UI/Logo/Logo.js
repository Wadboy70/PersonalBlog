import React from 'react';

import styles from './Logo.module.scss';
import Link from 'components/Link/Link';

const Logo = () => {

    return(
        <Link 
            className={styles.logoContainer}
            href='/'
        >
            <img 
                src="/logo.png" 
                className={styles.logoContainer_logo}
            />
            <h3 className={styles.logoContainer_name}>Seyi Oluwaleimu</h3>
        </Link>
    );
};

export default Logo;