import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // TODO: Check if user is authenticated
  const session = await getSession({req});
  if(!session){
    res.status(401).send({ message:" UnAuthorized."})
  }

  // TODO: Retrieve home ID from request
  const { id } = req.query;

  // TODO: Add home to favorite
  if (req.method === 'PUT') {
    //...
    try {
        const user = await prisma.user.update({
            where: {email: session.user.email},
            data: {
                favouriteHomes : {
                    connect: {id},
                }
            },
            include: {
                listedHomes: true,
                favouriteHomes: true,
            }
        });
        res.status(200).json(user)
    } catch (error) {
      console.log("error put favorite", error)
        res.status(500).send({message: "Something went wrong!"})
    }
  }
  // TODO: Remove home from favorite
  else if (req.method === 'DELETE') {
    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          favouriteHomes: {
            disconnect: { id },
          },
        },
        include: {
          listedHomes: true,
          favouriteHomes: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}