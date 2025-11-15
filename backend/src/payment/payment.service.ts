import { Injectable } from '@nestjs/common';
import * as Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID') || '',
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET') || '',
    });
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes: {
        description: 'ATS Resume Enhancement - Premium Features',
      },
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      };
    } catch (error) {
      throw new Error(`Failed to create Razorpay order: ${error.message}`);
    }
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET') || '');
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}

