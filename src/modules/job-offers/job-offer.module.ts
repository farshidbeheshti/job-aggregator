import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobOffer } from './job-offer.entity';
import { JobOfferService } from './job-offer.service';
import { JobOffersController } from './job-offers.controller';
import { LocationModule } from '../locations';
import { SkillModule } from '../skills/';
import { ConfigModule } from '@nestjs/config';
import jobOfferConfig from './config/job-offer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOffer]),
    ConfigModule.forFeature(jobOfferConfig),
    LocationModule,
    SkillModule,
  ],
  providers: [JobOfferService],
  controllers: [JobOffersController],
  exports: [JobOfferService],
})
export class JobOfferModule {}
