import { Cart } from '@modules/Cart/models/Cart';
import { ICartRepository } from '@modules/Cart/repositories/CartRepository.interface';
import { Product } from '@modules/Product/models/Product';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { Paid_status } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGroupDTO, IShowDashboardDTO } from './dto/ShowDashboardDTO';

interface IProductOrder extends Product {
  order_date: Date;
}

interface IDashboardGroup {
  categories: string[];
  datas: {
    date: Date;
    quantity: number;
  }[];
}

@injectable()
class ShowDashboardService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('CartRepository')
    private cartRepository: ICartRepository,
  ) {}

  public async execute({
    start_date,
    end_date,
    compareGroups,
    division_split = 12,
  }: IShowDashboardDTO): Promise<IDashboardGroup[]> {
    const orders = await this.cartRepository.listBy(
      {
        filters: {
          // paid or refunded
          paid_status: {
            in: [Paid_status.PAID, Paid_status.REFUNDED],
          },
        },
        customFilters: {
          start_date,
          end_date,
        },
        page: undefined,
        limit: undefined,
      },
      {
        include: {
          categories: true,
          cart_items: {
            include: {
              cart: true,
            },
          },
        },
      },
    );

    const products = this.getProducts(orders.results);

    const groups = this.getAndGroups(products, compareGroups);

    const interval =
      (end_date.getTime() - start_date.getTime()) / division_split;

    const intervalDates: Date[] = [];

    for (
      let currentDate = start_date;
      currentDate <= end_date;
      currentDate.setTime(currentDate.getTime() + interval)
    ) {
      intervalDates.push(new Date(currentDate));
    }

    const result = groups.map(group => {
      return {
        categories: group.categories,
        datas: intervalDates.map(date => {
          const filteredProducts = group.products.filter(product => {
            const isBetween =
              product.order_date.getTime() >= date.getTime() &&
              product.order_date.getTime() <=
                date.getTime() + interval - 1 * 24 * 60 * 60 * 1000;

            return isBetween;
          });

          return {
            date,
            quantity: filteredProducts.length,
          };
        }),
      };
    });

    return result;
  }

  getProducts(orders: Cart[]): IProductOrder[] {
    const allProducts = orders.reduce((acc, order) => {
      const products = order.cart_items.map(item => {
        return {
          ...item.product,
          order_date: order.created_at,
        } as IProductOrder;
      });
      return [...acc, ...products];
    }, [] as IProductOrder[]);

    return allProducts;
  }

  /**
   * this will return the products grouped by categories, the product needs to have at least one category in categories
   */
  getOrGroups(
    products: IProductOrder[],
    compareGroups: IGroupDTO[],
  ): {
    categories: string[];
    products: IProductOrder[];
  }[] {
    const groups = compareGroups.map(grp => {
      const group = products.filter(product => {
        const hasCategory = grp.categories.find(cat => {
          const has = product.categories?.find(c => c.name === cat);
          return !!has;
        });
        return !!hasCategory;
      });
      return {
        categories: grp.categories,
        products: group,
      };
    });

    return groups;
  }

  /**
   * this will return the products grouped by categories, the product needs to have all categories in categories
   */
  getAndGroups(
    products: IProductOrder[],
    compareGroups: IGroupDTO[],
  ): {
    categories: string[];
    products: IProductOrder[];
  }[] {
    const groups = compareGroups.map(grp => {
      const group = products.filter(product => {
        const hasAllCategories = grp.categories.every(cat => {
          const has = product.categories?.find(c => c.name === cat);
          return !!has;
        });
        return !!hasAllCategories;
      });
      return {
        categories: grp.categories,
        products: group,
      };
    });

    return groups;
  }
}

export { ShowDashboardService };
