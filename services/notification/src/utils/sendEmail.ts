import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import logger from '../logger';
import { createExcelFile } from './generateExcel';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY as string);

export async function processMessageAndSendEmail(msg: any, channel: any) {
  if(msg) {
    const contentAsString = msg.content.toString();
    const contentAsJSON = JSON.parse(contentAsString);
    logger.info("Received:", contentAsJSON);
    const filePath = path.join(__dirname, 'ProductListBelowThreshold.xlsx')
    await createExcelFile(contentAsJSON, filePath);
    logger.info(`Excel file created: ${filePath}`);
    const attachments = [{
      content: fs.readFileSync(filePath).toString('base64'),
      filename: 'ProductList.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment',
    }];
    const emailMsg = {
      to: 'rishiwhite@gmail.com', // Change to your recipient
      from: 'rishiwhite@gmail.com', // Change to your verified sender
      subject: 'Product list below thresold',
      text: 'Attached is the product list below threshold in Excel format.',
      attachments,
    };

    try {
      await sgMail.send(emailMsg);
      logger.info('Email sent with the Excel attachment');
    } catch (error) {
      logger.error(error);

    }
   }
  }
