const request = require('supertest');
const nock = require('nock');
const assert = require('assert');
const app = require('../../app');
const setUp = require('../setupTests');

describe('Test the Payments Routes', () => {
    it('enables a user to make a payment', async () => {
        //here we shall first register a user who will later save a payment
        await request(app)
            .post('/users/register')
            .send(setUp.userForPaymentsTest);

        const data = {
            user_id: 1,
            initial_amount: 200000,
        };
        const result = await request(app)
            .post('/payments')
            .send(data)
            .set('Authorization', setUp.authToken);

        assert(result.body.message === 'Payment has been recorded');
    });
});
