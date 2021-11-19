import React from 'react';
import Substack from 'public/Substack.svg';
import Instagram from 'public/Instagram.svg';
import Twitter from 'public/Twitter.svg';
import Youtube from 'public/Youtube.svg';
import styles from "./ScrollWindow.module.scss";

const ScrollWindow = () => {
    return(
        <div className={styles.scrollWindow}>
            <a href="https://seyio.substack.com" className={styles.scrollWindow_socialLink} target="_blank">
                <Substack/>
            </a>
            <a href="https://www.Instagram.com/wadboy" className={styles.scrollWindow_socialLink} target="_blank">
                <Instagram/>
            </a>
            <a href="https://www.Twitter.com/wadboy_" className={styles.scrollWindow_socialLink} target="_blank">
                <Twitter/>
            </a>
            <a href="https://www.youtube.com/channel/UCISzgic1hCFJko9zRmGcbkw/featured" className={styles.scrollWindow_socialLink} target="_blank">
                <Youtube/>
            </a>
        </div>
    );
};

export default ScrollWindow;