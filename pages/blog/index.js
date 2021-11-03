import { getPosts } from "../../lib/functions";
import Link from "next/link";

const Blog = ({posts}) => {

    return(                    
        <ul>
            {posts.map((post) => (
            <li key={post.id}>
                <Link href={`/posts/${post.slug}`}>
                <a>{post.title}</a>
                </Link>
            </li>
            ))}
        </ul>
    );
};

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
};

export default Blog;