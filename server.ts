import { Hono, type Context } from 'hono';
import { db } from './db.ts';
import { todosTable } from './schema.ts';
import { eq } from 'drizzle-orm';

const app = new Hono();

app.get('/', async (c: Context) => {
  try {
    const todos = await db.select().from(todosTable).all();
    return c.json(todos);
  } catch (error) {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.post('/', async (c: Context) => {
  try {
    const body = await c.req.json();
    const todos = await db
      .insert(todosTable)
      .values({
        name: body.name,
        status: body.status,
      })
      .returning();
    return c.json(todos);
  } catch (error) {
    console.error('Error handling the request:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/todos', async (c: Context) => {
  try {
    await db.delete(todosTable).all();
    return c.text('All todos deleted');
  } catch (error) {
    console.error('Error deleting the todo:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    await db.delete(todosTable).where(eq(todosTable.id, id)).returning();
    return c.text(`${id} Succesfully Deleted`);
  } catch (error) {
    console.error('Error deleting the todo:', error);
    return c.text('Internal Server Error', 500);
  }
});

app.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'));
    const body = await c.req.json();
    await db
      .update(todosTable)
      .set({ status: body.status })
      .where(eq(todosTable.id, id))
      .returning();
    return c.text(`${id} Updated Succesfully`);
  } catch (error) {
    console.error('Error deleting the todo:', error);
    return c.text('Internal Server Error', 500);
  }
});

Deno.serve(app.fetch);
