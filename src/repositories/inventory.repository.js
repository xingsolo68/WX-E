import { Inventory } from '../models'

export class InventoryRepository {
    static async insert({ productId, shopId, stock, location = 'unknown' }) {
        return await Inventory.create({ productId, shopId, stock, location })
    }
}
