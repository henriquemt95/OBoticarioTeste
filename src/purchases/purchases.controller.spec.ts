// import { Test, TestingModule } from '@nestjs/testing';
// import { PurchaseController } from './purchases.controller';
// import { PurchaseService } from './purchase.service';

// describe('PurchaseController', () => {
//   let app: TestingModule;

//   beforeAll(async () => {
//     app = await Test.createTestingModule({
//       controllers: [PurchaseController],
//       providers: [PurchaseService],
//     }).compile();
//   });

//   describe('newPurchase', () => {
//     it('should return "Hello World!"', () => {
//       const purchaseController = app.get<PurchaseController>(PurchaseController);
//       expect(purchaseController.newPurchase()).toBe('Hello World!');
//     });
//   });

//   describe('purchaseByAuthenticatedUser', () => {
//     it('should return "Hello World!"', () => {
//       const purchaseController = app.get<PurchaseController>(PurchaseController);
//       expect(purchaseController.purchaseByAuthenticatedUser()).toBe('Hello World!');
//     });
//   });
// });
