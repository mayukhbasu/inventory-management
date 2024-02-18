import * as cron from 'node-cron';
import axios from 'axios'; // Using axios for making HTTP requests

export async function checkAlertStockLevels() {
  try {
    const response = await axios.get('http://localhost:3000/inventory/alert-stock-level');
    console.log('Response from /alert-stock-level:', response.data);
  } catch (error) {
    console.error('Error calling /alert-stock-level:', error);
  }
}

export function startScheduledTask() {
  // Schedule the task to run every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    console.log('Checking /alert-stock-level endpoint');
    checkAlertStockLevels();
  });
}