import { db, getSingleFirestoreDoc } from "lib/firestoreServer";
import { COLLECTION_NAMES } from "lib/firestore";
import styles from "components/styles/journal.module.scss";

const PostPage = ({ post }) => {
  const parsedPost = JSON.parse(post);
  const date = new Date(parsedPost.date?._seconds * 1000);
  return (
    <div className={styles.container}>
      <h1>{parsedPost.name}</h1>
      <p>{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</p>
      <div dangerouslySetInnerHTML={{ __html: parsedPost.entry }} />
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
  return {
    props: {
      post,
    },
  };
};
