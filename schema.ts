import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const todosTable = sqliteTable('todos', {
  id: integer().primaryKey(),
  name: text(),
  status: text(),
});
