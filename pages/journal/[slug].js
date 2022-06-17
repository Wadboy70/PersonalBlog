import { db, getSingleFirestoreDoc } from "lib/firestoreServer";
import { COLLECTION_NAMES } from "lib/firestore";
import Link from "next/link";
import Arrow from "public/Arrow.svg";
import styles from "components/styles/journal.module.scss";

const PostPage = ({ post, prev, next }) => {
  const parsedPost = JSON.parse(post);
  const date = new Date(parsedPost.date?._seconds * 1000);
  return (
    <div className={styles.container}>
      <Link href="/journal">
        <a className={styles.arrowContainer}>
          <Arrow className={styles.arrow} />
          Back
        </a>
      </Link>
      <h1>{parsedPost.name}</h1>
      <p>{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</p>
      <div dangerouslySetInnerHTML={{ __html: parsedPost.entry }} />
      <div className={styles.navigationContainer}>
        <span>
          {prev && (
            <Link href={"/journal/" + prev}>
              <a className={styles.arrowContainer}>
                <Arrow className={styles.arrow} />
                Previous Post!
              </a>
            </Link>
          )}
        </span>
        <span>
          {next && (
            <Link href={"/journal/" + next}>
              <a
                className={[
                  styles.arrowContainer,
                  styles.flippedContainer,
                ].join(" ")}
              >
                <Arrow className={[styles.arrow, styles.flipped].join(" ")} />
                Next Post!
              </a>
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default PostPage;

export const getStaticPaths = async () => {
  const paths = (
    await db.collection(COLLECTION_NAMES.JOURNALS).listDocuments()
  ).map((entry) => ({ params: { slug: entry.id } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const post = JSON.stringify(
    await getSingleFirestoreDoc(COLLECTION_NAMES.JOURNALS, slug)
  );

  const docRef = db.collection(COLLECTION_NAMES.JOURNALS).doc(slug);
  const snapshot = await docRef.get();
  const coll = db.collection(COLLECTION_NAMES.JOURNALS);
  const prev =
    (await (
      await coll.orderBy("date").startAfter(snapshot).limit(1).get()
    ).docs?.[0]?.id) || null;
  const next =
    (await (
      await coll.orderBy("date", "desc").startAfter(snapshot).limit(1).get()
    ).docs?.[0]?.id) || null;

  return {
    props: {
      post,
      prev,
      next,
    },
  };
};
