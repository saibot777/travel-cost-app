import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { Company, TravelCost } from './interfaces';
import { HttpService } from '@nestjs/axios';

const COMPANIES_API =
  'https://5f27781bf5d27e001612e057.mockapi.io/webprovise/companies';

const TRAVELS_API =
  'https://5f27781bf5d27e001612e057.mockapi.io/webprovise/travels';

@Injectable()
export class TravelCostService {
  private readonly logger = new Logger(TravelCostService.name);

  constructor(private httpService: HttpService) {}

  async getCompaniesWithTravelCost(): Promise<Company[]> {
    const companyList = await this.getCompanyList();
    const travelList = await this.getTravelList();

    // Calculate the total travel cost for each company and add it to the result
    const companiesWithTravelCost = companyList.map((company) => ({
      ...company,
      totalTravelCost: this.calculateTravelCost(
        company.id,
        travelList,
        companyList,
      ),
    }));

    return companiesWithTravelCost;
  }

  private async getCompanyList(): Promise<Company[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Company[]>(COMPANIES_API).pipe(
        catchError((error: any) => {
          this.logger.error(error);
          throw new Error(error);
        }),
      ),
    );
    return data;
  }

  private async getTravelList(): Promise<TravelCost[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<TravelCost[]>(TRAVELS_API).pipe(
        catchError((error) => {
          this.logger.error(error);
          throw new Error(error);
        }),
      ),
    );
    return data;
  }

  private calculateTravelCost(
    companyId: string,
    travelList: TravelCost[],
    companyList: Company[],
  ): number {
    const childCompanies = this.getChildCompanies(companyId, companyList);
    const companyAndChildrenIds = [...childCompanies, companyId];

    const totalCost = travelList
      .filter((travel) => companyAndChildrenIds.includes(travel.companyId))
      .reduce((sum, travel) => sum + parseFloat(travel.price), 0);

    return totalCost;
  }

  private getChildCompanies(
    parentId: string,
    companyList: Company[],
  ): string[] {
    const childCompanyIds = companyList
      .filter((company) => company.parentId === parentId)
      .map((company) => company.id);

    const grandChildCompanyIds: string[] = [];
    for (const childId of childCompanyIds) {
      grandChildCompanyIds.push(
        ...this.getChildCompanies(childId, companyList),
      );
    }

    return [...childCompanyIds, ...grandChildCompanyIds];
  }
}
