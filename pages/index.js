import styles from 'components/index/index.module.scss';
import Arrow from '../public/Arrow.svg';
import { getRecentPost } from 'lib/functions';
import Post from 'components/Post/Post';


const Index = ({notFound, post}) => (
  <>
    <div className = {styles.homeContainer}>
      <img src="/FrontImage.png" alt="seyi" className={styles.homeContainer__seyi}/>
      <div className={styles.homeContainer__homeHeroText}>
        <h1>HI!</h1>
        <h1>I'M SEYI</h1>
        <p>I'm a developer 💻, writer 📜, and student 😁</p>
        <div className={styles.homeHeroText__CTA}>
          <Arrow className={styles.bounce}/>
          <button>Check out my writing!</button>
        </div>
      </div>
    </div>
    {
      !notFound &&
      <Post data={post}/>
    }
  </>
);

export async function getStaticProps(context) {
  const post = await getRecentPost();

  if (!post || !post.length) {
    return {
      notFound: true,
    };
  }
  return {
    props: { post: post[0] },
    revalidate: 1,
  };
};

export default Index;