const prepareRaiseCalculations = require('../src/prepareRaiseCalculations.js');
const { MAX_MULTIPLIER, MIN_MULTIPLIER } = require('../src/constants');

describe('prepareRaiseCalculations', () => {
    let database;

    beforeEach(() => {
        database = {
            save: jest.fn()
        };
    });

    it('cachedValue should be multiplied by max between 1.20 and multiplier', () => {
        const dataDescriptors = [{ type: 'foo', cachedValue: 100 }];
        const calculationsQueue = [];
        const multiplier = 1.5;

        prepareRaiseCalculations(dataDescriptors, calculationsQueue, database, multiplier);

        expect(calculationsQueue.length).toBe(1);

        calculationsQueue[0]();

        expect(dataDescriptors[0].cachedValue).toBe(100 * Math.max(MAX_MULTIPLIER, multiplier));
    });

    it('cachedValue should be multiplied by min between multiplier and 1.02', () => {
        const dataDescriptors = [{ type: 'bar', cachedValue: 100 }];
        const calculationsQueue = [];
        const multiplier = 1.5;

        prepareRaiseCalculations(dataDescriptors, calculationsQueue, database, multiplier);

        expect(calculationsQueue.length).toBe(1);

        calculationsQueue[0]();

        expect(dataDescriptors[0].cachedValue).toBe(100 * Math.min(multiplier, MIN_MULTIPLIER));
    });

    it('should handle error when saving in database', () => {
        const dataDescriptors = [{ type: 'foo', cachedValue: 100 }];
        const calculationsQueue = [];
        const multiplier = 1.5;

        const databaseWithError = {
            save: jest.fn(() => {
                throw new Error('Database error');
            })
        };

        console.error = jest.fn();

        prepareRaiseCalculations(dataDescriptors, calculationsQueue, databaseWithError, multiplier);

        expect(calculationsQueue.length).toBe(1);

        calculationsQueue[0]();

        expect(console.error).toHaveBeenCalledWith("Error saving dataDescriptor:", new Error('Database error'));
    });
});
