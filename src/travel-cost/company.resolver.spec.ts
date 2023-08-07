import { Test, TestingModule } from '@nestjs/testing';
import { CompanyResolver } from './company.resolver';
import { TravelCostService } from './travel-cost.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Company, TravelCost } from './interfaces';

describe('CompanyResolver', () => {
  let resolver: CompanyResolver;
  let travelCostService: TravelCostService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyResolver,
        TravelCostService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<CompanyResolver>(CompanyResolver);
    travelCostService = module.get<TravelCostService>(TravelCostService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCompaniesWithTravelCost', () => {
    it('should return an array of companies with associated travel costs', async () => {
      // Mock the company and travel data for testing
      const companyList: Company[] = [
        {
          id: 'uuid-1',
          createdAt: '2021-02-26T00:55:36.632Z',
          name: 'Webprovise Corp',
          parentId: '0',
        },
        {
          id: 'uuid-2',
          createdAt: '2021-02-25T10:35:32.978Z',
          name: 'Stamm LLC',
          parentId: 'uuid-1',
        },
      ];
      const travelCostList: TravelCost[] = [
        {
          id: 'uuid-t1',
          createdAt: '2020-08-27T00:22:26.927Z',
          employeeName: 'Garry Schuppe',
          departure: 'Saint Kitts and Nevis',
          destination: 'Pitcairn Islands',
          price: '362.00',
          companyId: 'uuid-1',
        },
        {
          id: 'uuid-t2',
          createdAt: '2020-11-08T22:44:37.483Z',
          employeeName: 'Alison Kohler Sr.',
          departure: 'Guatemala',
          destination: 'Belgium',
          price: '835.00',
          companyId: 'uuid-2',
        },
      ]
      const companiesWithTravelCostFinal: Company[] = [
        {
          id: 'uuid-1',
          createdAt: '2021-02-26T00:55:36.632Z',
          name: 'Webprovise Corp',
          parentId: '0',
          totalTravelCost: 1197,
        },
        {
          id: 'uuid-2',
          createdAt: '2021-02-25T10:35:32.978Z',
          name: 'Stamm LLC',
          parentId: 'uuid-1',
          totalTravelCost: 835,
        },
      ];

      // Mock the getCompanyList method in the service
      jest
        .spyOn<TravelCostService, any>(travelCostService, 'getCompanyList')
        .mockResolvedValue(companyList);

      // Mock the getTravelList method in the service
      jest
        .spyOn<TravelCostService, any>(travelCostService, 'getTravelList')
        .mockResolvedValue(travelCostList);

      // Mock the HttpService get method
      jest.spyOn(httpService, 'get').mockReturnValue({
        pipe: jest.fn(() => of({ data: companiesWithTravelCostFinal })),
      } as any);

      const result = await resolver.getCompaniesWithTravelCost();
      expect(result).toEqual(companiesWithTravelCostFinal);
    });
  });
});
