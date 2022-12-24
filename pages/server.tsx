const Server = () => {
  return <div>Server</div>;
};

export default Server;

// export async function getServerSideProps(ctx) {
//   console.log('💋', ctx.req);
//   const url = 'https://reqres.in/api/users?page=1';
//   const response = await fetch(url).then((res) => res.json());

//   return {
//     props: { data: response.data },
//   };
// }
