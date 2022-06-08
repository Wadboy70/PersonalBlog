import Link from "next/link";
import { COLLECTION_NAMES } from "lib/firestore";
import { db } from "lib/firestoreServer";

const Journal = ({ posts }) => {
  const parsedPosts = JSON.parse(posts);
  return (
    <div>
      {parsedPosts.map((post, index) => {
        const date = new Date(post.date._seconds * 1000);
        return (
          <Link href={"/journal/" + post.slug} passHref key={index}>
            <a key={index}>
              <h2>{post.name || "Untitled"}</h2>
              <p>{`${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`}</p>
              <p>{post.description || ""}</p>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps = async () => {
  //paginated query for the journal entries
  const entries = db
    .collection(COLLECTION_NAMES.JOURNALS)
    .orderBy("date")
    .limit(10);

  // const snapshot = (await first.get()).docs[0].data(); this is how you get data from a querysnapshot
  const posts = (await (await entries.get()).docs).map((entry) => entry.data());

  return {
    props: {
      posts: JSON.stringify(posts),
    },
  };
};

export default Journal;
