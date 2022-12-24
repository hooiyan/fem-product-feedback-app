import { supabase } from 'lib/supabaseClient';
import styles from '../styles/Home.module.css';

export default function Home() {
  console.log(supabase);

  return <div className={styles.container}>Hello Next.js</div>;
}

// export async function getStaticProps() {
//   const url = process.env.SUPABASE_URL;

//   return {
//     props: { url },
//   };
// }
