import { Order } from './Order';

/**
 * Define the abstract inteface for the Orders Service
 */
export interface IOrdersService {

    /**
     * Returns the whole list of orders
     * @returns The whole list of orders
     */
    GetOrders: () => Promise<Order[]>;

    /**
     * Retrieves a specific order by ID
     * @param id The ID of the order to retrieve
     * @returns A specific order by ID
     */
    GetOrder: (id: string) => Promise<Order>;

    /**
     * Adds a new order
     * @param order The order to add
     * @returns The just inserted order
     */
    AddOrder: (order: Order) => Promise<Order>;

    /**
     * Updates an already existing order
     * @param order The updated order to save
     * @returns The just updated order
     */
    UpdateOrder: (order: Order) => Promise<Order>;

    /**
     * Deletes a specific order by ID
     * @param id The ID of the order to delete
     */
    DeleteOrder: (id: string) => Promise<void>;
}

export class OrdersService implements IOrdersService {

    /**
     * Returns the whole list of orders
     * @returns The whole list of orders
     */
    public async GetOrders(): Promise<Order[]> {
        return null;
    }

     /**
      * Retrieves a specific order by ID
      * @param id The ID of the order to retrieve
      * @returns A specific order by ID
      */
    public async GetOrder(id: string): Promise<Order> {
        return null;
    }
 
     /**
      * Adds a new order
      * @param order The order to add
      * @returns The just inserted order
      */
    public async AddOrder(order: Order): Promise<Order> {
        return null;
    }
 
     /**
      * Updates an already existing order
      * @param order The updated order to save
      * @returns The just updated order
      */
    public async UpdateOrder(order: Order): Promise<Order> {
        return null;
    }
 
     /**
      * Deletes a specific order by ID
      * @param id The ID of the order to delete
      */
     public async DeleteOrder(id: string): Promise<void> {
        return;
     }
}

export const ordersService = new OrdersService();