import { getPosts } from "lib/functions";
import BlogListing from "components/BlogListing/BlogListing";

const Blog = ({posts}) => {

    return(      
      <div>
        <ul>
            {posts.map((post) => (
              <BlogListing key={post.id} post={post}/>
            ))}
        </ul>
      </div>              
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