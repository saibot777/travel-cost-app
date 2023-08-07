import { Resolver, Query } from '@nestjs/graphql';
import { TravelCostService } from './travel-cost.service';
import { Company } from './interfaces';

@Resolver('Company')
export class CompanyResolver {
  constructor(private readonly travelCostService: TravelCostService) {}

  @Query('companiesWithTravelCost')
  async getCompaniesWithTravelCost(): Promise<Company[]> {
    const companiesWithTravelCost =
      await this.travelCostService.getCompaniesWithTravelCost();
    return companiesWithTravelCost;
  }
}
