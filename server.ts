import { Hono, type Context } from 'hono';
import { db } from './db.ts';
import { todosTable } from './schema.ts';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const todoSchema = z.object({
  name: z.string(),
  status: z.string(),
});

const app = new Hono()
  .get('/', async (c: Context) => {
    try {
      const todos = await db.select().from(todosTable).all();
      return c.json(todos);
    } catch (error) {
      console.error('Error handling the request:', error);
      return c.text('Internal Server Error', 500);
    }
  })
  .post('/', async (c: Context) => {
    try {
      const body = await c.req.json();
      const validateSchema = todoSchema.parse(body);
      const todos = await db
        .insert(todosTable)
        .values(validateSchema)
        .returning();
      return c.json(todos);
    } catch (error) {
      console.error('Error handling the request:', error);
      return c.text('Internal Server Error', 500);
    }
  })
  .delete('/todos', async (c: Context) => {
    try {
      await db.delete(todosTable).all();
      return c.text('All todos deleted');
    } catch (error) {
      console.error('Error deleting the todo:', error);
      return c.text('Internal Server Error', 500);
    }
  })
  .delete('/:id', async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      await db.delete(todosTable).where(eq(todosTable.id, id)).returning();
      return c.text(`${id} Succesfully Deleted`);
    } catch (error) {
      console.error('Error deleting the todo:', error);
      return c.text('Internal Server Error', 500);
    }
  })
  .put('/:id', async (c: Context) => {
    try {
      const id = Number(c.req.param('id'));
      const body = await c.req.json();
      const updateSchema = z.object({
        status: z.string(),
      });
      const validateSchema = updateSchema.parse(body);
      await db
        .update(todosTable)
        .set(validateSchema)
        .where(eq(todosTable.id, id))
        .returning();
      return c.text(`${id} Updated Succesfully`);
    } catch (error) {
      console.error('Error deleting the todo:', error);
      return c.text('Internal Server Error', 500);
    }
  });

export default app;
export type AppType = typeof app;
