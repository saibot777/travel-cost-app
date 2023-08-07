export interface Company {
  id: string;
  createdAt: string;
  name: string;
  parentId: string;
  totalTravelCost?: number;
}

export interface TravelCost {
  id: string;
  createdAt: string;
  employeeName: string;
  departure: string;
  destination: string;
  price: string;
  companyId: string;
}
