import fastify from 'fastify';
import cors from '@fastify/cors';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = fastify();
const prisma = new PrismaClient();

app.register(cors, {
  origin: (origin, cb) => {
    cb(null, true);
  }
});

app.get('/users', async (req, rep) => {
  const users = await prisma.user.findMany();

  return { users };
});

app.post('/users', async (req, rep) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { name, email } = createUserSchema.parse(req.body);

  await prisma.user.create({
    data: {
      name,
      email
    }
  });

  return rep.status(201).send();
});

app.get('/users/:id', async (req, rep) => {
  const getUserSchema = z.object({
    id: z.string(),
  });

  const { id } = getUserSchema.parse(req.params);

  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });

  return { user };
});

app.delete('/users/:id', async (req, rep) => {
  const deleteUserSchema = z.object({
    id: z.string(),
  });

  const { id } = deleteUserSchema.parse(req.params);

  await prisma.user.delete({
    where: {
      id
    }
  });

  return rep.status(204).send();
});

app.put('/users/:id', async (req, rep) => {
  const updateUserSchemaParams = z.object({
    id: z.string(),
  });

  const updateUserSchemaBody = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { id } = updateUserSchemaParams.parse(req.params);
  const { name, email } = updateUserSchemaBody.parse(req.body);

  await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      email
    }
  });

  return rep.status(204).send();
});

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log('HTTP server Running');
});
