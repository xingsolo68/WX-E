import {
    describe,
    beforeEach,
    expect,
    beforeAll,
    afterAll,
    it,
    vi,
} from 'vitest'
import { Discount } from '../../models'
import { DiscountService } from '../../services/discount.service'
import { BadRequestError, NotFoundError } from '../../errors'
import { ShopFactory, DiscountFactory, ProductFactory } from '../factories'
import sequelizeService from '../../services/sequelize.service'

const mockDate = (date) => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(date))
}

describe('Discount service', () => {
    let payload
    let testShop

    afterAll(async () => {
        await sequelizeService.clean()
    })
    describe('createDiscountCode', () => {
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

    describe('getAllDiscountCodeWithProducts', () => {
        let testShop
        let testDiscount

        beforeAll(async () => {
            testShop = await ShopFactory.create()
        })

        afterAll(async () => {
            await sequelizeService.clean()
        })

        it('should return products with "all" appliesTo discount', async () => {
            const code = 'DISCOUNT_CODE'
            const userId = 1

            testDiscount = await DiscountFactory.create({
                code,
                shopId: testShop.id,
                isActive: true,
                appliesTo: 'all',
            })

            await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })
            await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })

            const result = await DiscountService.getAllDiscountCodeWithProducts(
                code,
                testShop.id,
                userId
            )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('name')
        })

        it('should return products with specific appliesTo discount', async () => {
            const code = 'DISCOUNT_CODE'
            const userId = 1

            const product1 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })
            const product2 = await ProductFactory.create('Earphone', {
                shopId: testShop.id,
                isPublished: true,
            })

            testDiscount = await DiscountFactory.create({
                code,
                shopId: testShop.id,
                isActive: true,
                appliesTo: 'specific',
            })

            await testDiscount.addProduct(product1)
            await testDiscount.addProduct(product2)

            const result = await DiscountService.getAllDiscountCodeWithProducts(
                code,
                testShop.id,
                userId
            )

            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('name')
        })

        it('should throw NotFoundError if discount is not found or inactive', async () => {
            const code = 'INVALID_CODE'
            const userId = 1

            await expect(
                DiscountService.getAllDiscountCodeWithProducts(
                    code,
                    testShop.id,
                    userId
                )
            ).rejects.toThrow('Discount not exist!')
        })
    })

    describe('getDiscountAmount', () => {
        let userId, testDiscount

        beforeEach(async () => {
            userId = 1
            testShop = await ShopFactory.create({})
            mockDate('2023-06-01')

            testDiscount = await DiscountFactory.create({
                code: 'DISCOUNT2023',
                shopId: testShop.id,
                isActive: true,
                maxUses: 10,
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                minOrderValue: 100,
                type: 'percentage',
                value: 10,
            })
        })

        it('should throw an error if discount code does not exist', async () => {
            const code = 'INVALID_CODE'
            const products = []

            await expect(
                DiscountService.getDiscountAmount({
                    code,
                    userId,
                    shopId: testShop.id,
                    products,
                })
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw an error if discount is inactive', async () => {
            testDiscount.isActive = false
            await testDiscount.save()

            const code = testDiscount.code
            const products = []

            await expect(
                DiscountService.getDiscountAmount({
                    code,
                    userId,
                    shopId: testShop.id,
                    products,
                })
            ).rejects.toThrow(BadRequestError)
        })

        it('should throw an error if discount has expired', async () => {
            testDiscount.startDate = new Date('2020-01-01')
            testDiscount.endDate = new Date('2020-12-31')
            await testDiscount.save()

            const code = testDiscount.code
            const products = []

            await expect(
                DiscountService.getDiscountAmount({
                    code,
                    userId,
                    shopId: testShop.id,
                    products,
                })
            ).rejects.toThrow(NotFoundError)
        })

        it('should throw an error if order value is below minimum order value', async () => {
            testDiscount.startDate = new Date('2023-01-01')
            testDiscount.endDate = new Date('2023-12-31')
            await testDiscount.save()

            const code = testDiscount.code
            const products = [{ quantity: 1, price: 50 }]

            await expect(
                DiscountService.getDiscountAmount({
                    code,
                    userId,
                    shopId: testShop.id,
                    products,
                })
            ).rejects.toThrow(BadRequestError)
        })

        it('should return the correct discount amount for a percentage discount', async () => {
            const code = testDiscount.code
            const products = [{ quantity: 2, price: 60 }]

            const discountAmount = await DiscountService.getDiscountAmount({
                code,
                userId,
                shopId: testShop.id,
                products,
            })
            expect(discountAmount).toBe(12)
        })

        it('should return the correct discount amount for a fixed amount discount', async () => {
            testDiscount.type = 'fixed_amount'
            testDiscount.value = 20
            await testDiscount.save()

            const code = testDiscount.code
            const products = [{ quantity: 2, price: 60 }]

            const discountAmount = await DiscountService.getDiscountAmount({
                code,
                userId,
                shopId: testShop.id,
                products,
            })
            expect(discountAmount).toBe(20)
        })
    })

    describe('deleteDiscountCode', () => {
        let testDiscount

        beforeEach(async () => {
            testShop = await ShopFactory.create({})

            testDiscount = await DiscountFactory.create({
                code: 'DISCOUNT2023',
                shopId: testShop.id,
                isActive: true,
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                minOrderValue: 100,
                type: 'percentage',
                value: 10,
            })
        })

        it('should delete a discount code successfully', async () => {
            await DiscountService.deleteDiscountCode({
                code: testDiscount.code,
                shopId: testShop.id,
            })

            const foundDiscount = await Discount.findOne({
                where: { code: testDiscount.code, shopId: testShop.id },
            })

            expect(foundDiscount).toBeNull()
        })

        it('should throw an error if discount code does not exist', async () => {
            await expect(
                DiscountService.deleteDiscountCode({
                    code: 'NON_EXISTING_CODE',
                    shopId: testShop.id,
                })
            ).rejects.toThrow(NotFoundError)
        })
    })

    describe('cancelDiscountCode', () => {
        let testDiscount

        beforeEach(async () => {
            testShop = await ShopFactory.create({})

            testDiscount = await DiscountFactory.create({
                code: 'DISCOUNT2023',
                shopId: testShop.id,
                isActive: true,
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31'),
                minOrderValue: 100,
                type: 'percentage',
                value: 10,
            })
        })

        it('should cancel a discount code successfully', async () => {
            await DiscountService.cancelDiscountCode({
                code: testDiscount.code,
                shopId: testShop.id,
            })

            const foundDiscount = await Discount.findOne({
                where: { code: testDiscount.code, shopId: testShop.id },
            })

            expect(foundDiscount.isActive).toBe(false)
        })

        it('should throw an error if discount code does not exist', async () => {
            await expect(
                DiscountService.cancelDiscountCode({
                    code: 'NON_EXISTING_CODE',
                    shopId: testShop.id,
                })
            ).rejects.toThrow(NotFoundError)
        })
    })
})
