import Link from "next/link";
import { COLLECTION_NAMES } from "lib/firestore";
import { db as serverDb } from "lib/firestoreServer";
import styles from "components/styles/journal.module.scss";
import { useState } from "react";
import { useAuth } from "lib/AuthUserContext";

const Journal = ({ posts }) => {
  const parsedPosts = JSON.parse(posts);
  const [postNum, setPostNum] = useState(10);

  return (
    <div className={styles.listContainer}>
      <div className={styles.header}>
        <img src="/cartoon.png" alt="cartoon seyi" className={styles.cartoon} />
        <h1>Daily Journal</h1>
      </div>
      <p>
        Daily updates on my life, things I'm working on, and the ups and downs
        of being Seyi :)
      </p>
      {parsedPosts.slice(0, postNum + 1).map((post, index) => (
        <JournalPost post={post} key={index} />
      ))}
      <button
        onClick={() => {
          if (postNum < parsedPosts.length) setPostNum(postNum + 10);
          else console.log("dont make more");
        }}
        className={`${styles.moreButton} ${
          postNum >= parsedPosts.length ? styles.disableButton : ""
        }`}
      >
        More Posts
      </button>
      <button
        onClick={() => {
          if (postNum > 10) setPostNum(postNum - 10 > 10 ? postNum - 10 : 10);
          else console.log("dont make more");
        }}
        className={`${styles.moreButton} ${
          postNum <= 10 ? styles.disableButton : ""
        }`}
      >
        Less Posts
      </button>
    </div>
  );
};

const JournalPost = ({ post }) => {
  const { validUser } = useAuth();
  const date = post.date?._seconds ? new Date(post.date._seconds * 1000) : null;
  return (
    <Link href={"/journal/" + post.slug} passHref>
      <a className={styles.post}>
        <div className={styles.postInfo}>
          <h2 className={styles.postTitle}>{post.name || "Untitled"}</h2>
          <span className={styles.postData}>
            {date && (
              <p className={styles.date}>
                {date.toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}
            <span className={styles.tagContainer}>
              {post.tags?.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </span>
            {validUser && (
              <Link href={`/admin?slug=${post.slug}`}>
                <a>Edit</a>
              </Link>
            )}
          </span>
        </div>
        {post.description && (
          <p className={styles.description}>
            <em>{post.description || ""}</em>
          </p>
        )}
      </a>
    </Link>
  );
};

export const getStaticProps = async () => {
  //paginated query for the journal entries
  const entries = serverDb
    .collection(COLLECTION_NAMES.JOURNALS)
    .orderBy("date", "desc");

  const posts = (await (await entries.get()).docs).map((entry) => entry.data());

  return {
    props: {
      posts: JSON.stringify(posts),
    },
  };
};

export default Journal;
