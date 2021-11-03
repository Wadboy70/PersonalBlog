import React from 'react';
import styles from './Post.module.scss';

const Post = ({
    data: {
        feature_image,
        title,
        html
    }
}) => {
    return (
        <div className={styles.post}>
            <img src={feature_image} className={styles.post__displayImage}/>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
};

export default Post;