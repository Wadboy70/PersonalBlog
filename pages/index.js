import { getPosts } from "../lib/functions";
import Link from "next/link";
import styles from 'components/index/index.module.scss';

const Index = (props) => (
  <div>
    <ul>
      {props.posts.map((post) => (
        <li key={post.id}>
          <Link href={`/posts/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Index;

export async function getStaticProps(context) {
  const posts = await getPosts();

  if (!posts) {
    return {
      notFound: true,
    };
  }

  return {
    props: { posts },
    revalidate: 1,
  };
}
