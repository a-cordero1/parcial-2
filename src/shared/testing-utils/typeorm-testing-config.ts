/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from '../../pet/pet.entity';
import { UserEntity } from '../../user/user.entity';
import { ProductEntity } from '../../product/product.entity';
import { HomeEntity } from '../../home/home.entity';
import { FoundationEntity } from '../../foundation/foundation.entity';
import { PurchaseEntity } from '../../purchase/purchase.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      PetEntity,
      UserEntity,
      ProductEntity,
      HomeEntity,
      FoundationEntity,
      PurchaseEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    PetEntity,
    UserEntity,
    ProductEntity,
    HomeEntity,
    FoundationEntity,
    PurchaseEntity,
  ]),
];
