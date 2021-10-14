import React from 'react';
import Image from 'next/image';
import logo from 'public/logo.png'

import styles from './Logo.module.scss';
import Link from 'components/Link/Link';

const Logo = () => {

    return(
        <Link 
            className={styles.logoContainer}
            href='/'
        >
            <Image 
                src={logo} 
                className={styles.logoContainer_logo}
                objectFit={"contain"}
                width={64}
                height={64}
            />
            <h3 className={styles.logoContainer_name}>Seyi Oluwaleimu</h3>
        </Link>
    );
};

export default Logo;