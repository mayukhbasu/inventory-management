import { query } from "../config/db";

type stockType = 'order' | 'receipt';
export class StockModel {
  
  static async updateStock(productID: string, quantity: number, type: stockType): Promise<string> {
    let sql = '';
    if (type === 'order') {
        sql = 'UPDATE StockLevels SET Quantity = Quantity - $2 WHERE ProductID = $1';
    } else if (type === 'receipt') {
        sql = 'UPDATE StockLevels SET Quantity = Quantity + $2 WHERE ProductID = $1';
    }

    try {
        const res = await query(sql, [productID, quantity]);
        if (res.rowCount === 0) {
            throw new Error('Product not found or quantity update failed.');
        }
        return `Stock updated for product ${productID}, quantity ${quantity}, type ${type}`;
    } catch (err) {
        throw new Error(`An error occurred: ${err}`);
    }
}
  
}