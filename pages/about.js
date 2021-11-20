import React from 'react';
import Logo from "public/Logo.svg";
import styles from "components/styles/about.module.scss";

const About = () => {
    return(
        <div className={styles.aboutPage}>
            <Logo 
                className={styles.aboutPage_logo}
            />
            <p className={styles.aboutPage_about}>
                Hi!! My name is Seyi, I’m a <u>developer</u>, <u>writer</u> and am always working on new projects! I’m deeply intrigued with the process of figuring out this life thing, so I try to document that process for all passerby’s to witness my mistakes 😄

            </p>
        </div>
    );
};

export default About;