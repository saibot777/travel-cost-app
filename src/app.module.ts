import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TravelCostService } from './travel-cost/travel-cost.service';
import { CompanyResolver } from './travel-cost/company.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    HttpModule,
  ],
  controllers: [AppController, CompanyResolver],
  providers: [AppService, TravelCostService],
})
export class AppModule {}
