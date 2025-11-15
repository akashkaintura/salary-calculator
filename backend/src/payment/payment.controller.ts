import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: User) {
    const amount = 99; // ₹99 INR
    const receipt = `ats_premium_${user.id}_${Date.now()}`;
    
    const order = await this.paymentService.createOrder(amount, 'INR', receipt);
    
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // Frontend needs this for Razorpay checkout
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @CurrentUser() user: User,
    @Body() body: { orderId: string; paymentId: string; signature: string },
  ) {
    const isValid = await this.paymentService.verifyPayment(
      body.orderId,
      body.paymentId,
      body.signature,
    );

    if (isValid) {
      // Payment verified - you can save premium status to user here
      return {
        success: true,
        message: 'Payment verified successfully',
      };
    }

    return {
      success: false,
      message: 'Payment verification failed',
    };
  }
}

