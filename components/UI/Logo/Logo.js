import React from 'react';
import Image from 'next/image';
import logo from 'public/logo.png'

import styles from './Logo.module.scss';

const Logo = () => {

    return(
        <div className={styles.logoContainer}>
            <Image 
                src={logo} 
                className={styles.logoContainer_logo}
                objectFit={"contain"}
                width={80}
                height={200}
            />
            <h3 className={styles.logoContainer_name}>Seyi Oluwaleimu</h3>
        </div>
    );
};

export default Logo;