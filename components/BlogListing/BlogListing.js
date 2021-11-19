import React from 'react';
import Link from "components/Link/Link";
import styles from './BlogListing.module.scss';

const BlogListing = ({post}) => {
    return(
        <li>
          <Link href={"/blog/"+post.slug} className={styles.blogListing}>
              <div className={styles.blogListing__img}>
                <img src={post.feature_image} />
                </div>
              <div className={styles.blogListing__postInfo}>
                <h3>{post.title}</h3>
                <p>{new Date(post.created_at).toLocaleDateString()}</p>
                <p>{post.excerpt}</p>
              </div>
          </Link>
        </li>
    );
};

export default BlogListing;