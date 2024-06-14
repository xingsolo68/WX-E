import { describe, beforeEach, expect, afterEach, it, vi } from 'vitest'
import { Discount, Earphone, Product, Shop } from '../../models'
import { DiscountService } from '../../services/discount.service'
import { ShopFactory } from '../factories/shop.factory'
import { BadRequestError } from '../../errors/BadRequestError'

const mockDate = (date) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(date))
}

afterEach(async () => {
    await Discount.truncate({ cascade: true, restartIdentity: true })
    await Earphone.truncate({ cascade: true, restartIdentity: true })
    await Product.truncate({ cascade: true, restartIdentity: true })
    await Shop.truncate({ cascade: true, restartIdentity: true })
})

describe('Discount service', () => {
    describe('createDiscountCode', () => {
        let payload
        let testShop

        beforeEach(async () => {
            mockDate('2023-06-01')
            testShop = await ShopFactory.create({})
            payload = {
                code: 'DISCOUNT2023',
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                isActive: true,
                shopId: 1,
                minOrderValue: 100,
                productIds: [1, 2, 3],
                name: 'New Year Discount',
                description: 'Discount for New Year',
                type: 'percentage',
                value: 10,
                maxValue: 50,
                maxUses: 100,
                useCount: 0,
                maxUsesPerUser: 5,
                shopId: testShop.id,
                appliesTo: 'all',
            }
        })

        it('should create a new discount code successfully', async () => {
            const result = await DiscountService.createDiscountCode(payload)

            expect(result).toEqual(
                expect.objectContaining({
                    code: payload.code,
                    startDate: payload.startDate,
                    endDate: payload.endDate,
                    isActive: payload.isActive,
                    shopId: payload.shopId,
                    minOrderValue: payload.minOrderValue,
                    appliesTo: payload.appliesTo,
                    name: payload.name,
                    description: payload.description,
                    type: payload.type,
                    value: payload.value,
                    maxValue: payload.maxValue,
                    maxUses: payload.maxUses,
                    useCount: payload.useCount,
                    maxUsesPerUser: payload.maxUsesPerUser,
                })
            )
        })

        it('should throw an error if discount code already exists', async () => {
            await DiscountService.createDiscountCode(payload)

            await expect(
                DiscountService.createDiscountCode(payload)
            ).rejects.toThrow(BadRequestError)
        })

        it('should throw an error if end date is before start date', async () => {
            payload.startDate = new Date('2023-12-31')
            payload.endDate = new Date('2023-01-01')

            await expect(
                DiscountService.createDiscountCode(payload)
            ).rejects.toThrow(BadRequestError)
        })

        it('should throw an error if discount code has expired', async () => {
            payload.startDate = new Date('2020-01-01')
            payload.endDate = new Date('2020-12-31')

            await expect(
                DiscountService.createDiscountCode(payload)
            ).rejects.toThrow(BadRequestError)
        })
    })

    describe('updateDiscountCode', () => {
        let testShop, discount

        beforeEach(async () => {
            mockDate('2023-06-01')
            testShop = await ShopFactory.create({})

            // Create a discount code to be updated
            discount = await Discount.create({
                code: 'DISCOUNT2023',
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                isActive: true,
                shopId: testShop.id,
                minOrderValue: 100,
                name: 'New Year Discount',
                description: 'Discount for New Year',
                type: 'percentage',
                value: 10,
                maxValue: 50,
                maxUses: 100,
                useCount: 0,
                maxUsesPerUser: 5,
                appliesTo: 'all',
            })
        })

        it('should update an existing discount code successfully', async () => {
            const updatedData = {
                name: 'Updated Discount',
                description: 'Updated discount description',
                value: 15,
                maxValue: 60,
                maxUses: 150,
                maxUsesPerUser: 10,
            }

            await DiscountService.updateDiscountCode(
                discount.code,
                testShop.id,
                updatedData
            )

            const updatedDiscount = await Discount.findOne({
                where: { code: discount.code, shopId: testShop.id },
            })

            expect(updatedDiscount).toEqual(
                expect.objectContaining({
                    code: discount.code,
                    startDate: discount.startDate,
                    endDate: discount.endDate,
                    isActive: discount.isActive,
                    shopId: testShop.id,
                    minOrderValue: discount.minOrderValue,
                    appliesTo: discount.appliesTo,
                    name: updatedData.name,
                    description: updatedData.description,
                    type: discount.type,
                    value: updatedData.value,
                    maxValue: updatedData.maxValue,
                    maxUses: updatedData.maxUses,
                    useCount: discount.useCount,
                    maxUsesPerUser: updatedData.maxUsesPerUser,
                })
            )
        })

        it('should throw an error if discount code does not exist', async () => {
            const updatedData = { name: 'Updated Discount' }

            await expect(
                DiscountService.updateDiscountCode(
                    'NON_EXISTING_CODE',
                    testShop.id,
                    updatedData
                )
            ).rejects.toThrow(BadRequestError)
        })
    })
})
