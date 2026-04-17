export interface IRestaurant {
  _id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  rating: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRestaurantList {
  results: IRestaurant[];
  totalItem: number;
  totalPage: number;
}
