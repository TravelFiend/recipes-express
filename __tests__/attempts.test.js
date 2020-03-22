require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const Attempt = require('../lib/models/Attempt');

describe('event routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates an attempt', () => {
        return request(app)
            .post('/api/v1/attempts')
            .send({
                recipeId: 24,
                dateOfEvent: Date.now(),
                notes: 'did things',
                rating: 4
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    recipeId: 24,
                    dateOfEvent: expect.any(String),
                    notes: 'did things',
                    rating: 4,
                    __v: 0
                });
            });
    });

    it('gets all attempts', async() => {
        const attempts = await Attempt.create([
            { recipeId: 1, dateOfEvent: Date.now(), rating: 4 },
            { recipeId: 3, dateOfEvent: Date.now(), rating: 9 },
            { recipeId: 32, dateOfEvent: Date.now(), rating: 8 }
        ]);
        return request(app)
            .get('/api/v1/attempts')
            .then(res => {
                attempts.forEach(attempt => {
                    expect(res.body).toContainEqual(JSON.parse(JSON.stringify(attempt)));
                });
            });
    });

    it('gets a single attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: 32,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .get(`/api/v1/attempts/${attempt._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    recipeId: 32,
                    dateOfEvent: expect.any(String),
                    notes: 'crumbs',
                    rating: 1,
                    __v: 0
                });
            });
    });

    it('updates an attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: 32,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .patch(`/api/v1/attempts/${attempt._id}`)
            .send({ notes: 'bread' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: attempt._id.toString(),
                    recipeId: 32,
                    dateOfEvent: expect.any(String),
                    notes: 'bread',
                    rating: 1,
                    __v: 0
                });
            });
    });

    it('deletes attempt by id', async() => {
        const attempt = await Attempt.create({
            recipeId: 32,
            dateOfEvent: Date.now(),
            notes: 'crumbs',
            rating: 1
        });
        return request(app)
            .delete(`/api/v1/attempts/${attempt._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: attempt._id.toString(),
                    recipeId: 32,
                    dateOfEvent: expect.any(String),
                    notes: 'crumbs',
                    rating: 1,
                    __v: 0
                });
            });
    });
});
