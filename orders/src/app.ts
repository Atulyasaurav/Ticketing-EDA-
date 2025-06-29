import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@abhitickets/common';

import { deleteOrdersRouter } from "./routers/delete";
import { indexOrdersRouter } from "./routers/index";
import { newOrdersRouter } from "./routers/new";
import { showOrdersRouter } from "./routers/show";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(deleteOrdersRouter);
app.use(showOrdersRouter);
app.use(indexOrdersRouter);
app.use(newOrdersRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
