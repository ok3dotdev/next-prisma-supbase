import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import Banner from "@/components/Banner";
import homes from 'data.json';

import { prisma } from '@/lib/prisma';
import GridUsers from "@/components/GridUsers";

export async function getServerSideProps() {
  // Get all homes
  const homes = await prisma.home.findMany();
  const users = await prisma.user.findMany()
  // Pass the data to the Home page
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
      users: JSON.parse(JSON.stringify(users))
    },
  };
}

//Adding Comments
export default function Home({homes = [], users=[]}) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of our best roooms.
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
        <Banner classes='my-8 h-80 w-full'/>
        <GridUsers users={users}/>
        {/* {
          users ? users.map((user, idx)=>{
            return (
              <div key={idx}>
                <h3>{user.email}</h3>
                <h3>{user.age}</h3>
                <h3>{user.pronouns}</h3>
              </div>
            )
            
          }) : ""
        } */}
      </div>
    </Layout>
  );
}
