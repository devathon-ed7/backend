import { Router } from 'express';
import { TransactionModelInterface } from '../models/mariadb/transaction';
import { TransactionController } from '../controllers/transaction';
import transactionSchemas from '../schemas/transaction';
import { validatorHandler } from '../utils/validatorHandler';

type CreateTransactionRouterProps = {
  transactionModel: TransactionModelInterface;
};

export const createTransactionRouter = ({transactionModel}: CreateTransactionRouterProps) => {
  const transactionRouter = Router();
  const transactionController = new TransactionController({transactionModel});

  transactionRouter.get('/', transactionController.getAll);
  transactionRouter.post('/',validatorHandler(transactionSchemas.create, 'body'), transactionController.create);
  transactionRouter.get('/product/:id',validatorHandler(transactionSchemas.getByProductId, 'params'), transactionController.getByProudctId);
  transactionRouter.get('/code/:code',validatorHandler(transactionSchemas.getByCode, 'params'), transactionController.getByCode);
  transactionRouter.put('/:id',validatorHandler(transactionSchemas.update, 'params'), transactionController.update);
  transactionRouter.delete('/:id',validatorHandler(transactionSchemas.delete, 'params'), transactionController.delete);

  return transactionRouter;
};