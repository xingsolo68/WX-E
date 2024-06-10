import { describe, afterEach, it } from 'vitest'
import { Discount } from '../../models'
import { DiscountService } from '../../services/discount.service'

afterEach(async () => {
    await Discount.truncate({ cascade: true, restartIdentity: true })
    await Earphone.truncate({ cascade: true, restartIdentity: true })
    await Product.truncate({ cascade: true, restartIdentity: true })
    await Shop.truncate({ cascade: true, restartIdentity: true })
})

describe('Discount service', () => {
    describe('createDiscountCode', () => {
        it('should return a new discount code', async () => {
            const discount = await DiscountService.crecwateDiscountCodeh
        })
    })
})
