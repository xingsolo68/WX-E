import { describe, it, expect } from 'vitest'
import supertest from 'supertest'
import app from '../services/express.service'

describe('Product Controller', () => {
    it('return response 200', async () => {
        const response = await supertest(app).get('/healthcheck')
        expect(response.status).toBe(200)
    })
})
