import { Request, Response, Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.post('/orders',(req: Request, res: Response) => OrderController.orders(req, res));

// router.post('/update-stock',(req: Request, res: Response) => StockController.updateStock(req, res));
// router.get('/stock-level',(req: Request, res: Response) => StockController.getStockLevels(req, res));
// router.get('/alert-stock-level',(req: Request, res: Response) => StockController.getAlertStockLevels(req, res))



export default router;