import { Router } from 'express';

// ** Multer
import multer from 'multer';
import multerConfig from './config/multer';

// ** Controllers

import HealthCheckController from './app/controllers/HealthCheckController';
import UsersController from './app/controllers/UsersController';
import SessionsController from './app/controllers/SessionsController';
import RecipientsController from './app/controllers/RecipientsController';
import FilesController from './app/controllers/FilesController';
import DeliverymenController from './app/controllers/DeliverymenController';
import DeliveriesController from './app/controllers/DeliveriesController';
import OrdersController from './app/controllers/OrdersController';
import ProblemsController from './app/controllers/ProblemsController';

// ** Middlewares
import authMiddleware from './app/middlewares/auth';
import fileMiddleware from './app/middlewares/file';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionsController.store);
routes.post('/register', UsersController.register);

routes.get(
  '/health-555bf8344ca0caf09b42f55e185526d8',
  HealthCheckController.show
);

// ** Authentication middleware

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FilesController.store);

// routes.get('/deliverymen/:id', DeliverymenController.show);
routes.get('/deliverymen/:id/deliveries', OrdersController.index);
routes.post('/deliverymen/:id/deliveries/:deliveryId', OrdersController.store);
routes.put(
  '/deliverymen/:id/deliveries/:deliveryId',
  upload.single('file'),
  fileMiddleware,
  OrdersController.update
);
// ** PROVISÓRIO ** Fazer um método próprio para entregadores para checar se é o mesmo entregador que está visualizando os problemas
routes.get('/deliverymen/:id/problems/', ProblemsController.show);
routes.put(
  '/deliverymen/:id/deliveries/:deliveryId/problems/',
  ProblemsController.update
);

// ** admin middleware

routes.use(adminMiddleware);

routes.post('/users', UsersController.store);
routes.get('/users', UsersController.index);
routes.get('/users/:id', UsersController.show);
routes.put('/users/:id', UsersController.update);
routes.put('/users/:id/approve', UsersController.approve);
routes.delete('/users/:id', UsersController.delete);

routes.get('/recipients', RecipientsController.index);
routes.post('/recipients', RecipientsController.store);
routes.put('/recipients/:id', RecipientsController.update);
routes.delete('/recipients/:id', RecipientsController.delete);

// routes.get('/deliverymen', DeliverymenController.index);
// routes.post('/deliverymen', DeliverymenController.store);
// routes.put('/deliverymen/:id', DeliverymenController.update);
// routes.delete('/deliverymen/:id', DeliverymenController.delete);

routes.get('/deliveries', DeliveriesController.index);
routes.post('/deliveries', DeliveriesController.store);
routes.put('/deliveries/:id', DeliveriesController.update);
routes.delete('/deliveries/:id', DeliveriesController.delete);

routes.get('/deliveries/problems', ProblemsController.index);
routes.get('/deliveries/:id/problems/', ProblemsController.show);
routes.delete('/deliveries/:id/cancel', ProblemsController.delete);

export default routes;
