export type CartItemOptionOutput = {
  id: string;
  createdAt: string;
  updatedAt: string;
  optionId: string;
  option: {
    id: string;
    name: string;
    displayName: string;
    price: number;
    optionGroupId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CartItemOutput = {
  id: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  price: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  };
  itemOptions: CartItemOptionOutput[];
};

export type CartOutput = {
  id: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: CartItemOutput[];
};
