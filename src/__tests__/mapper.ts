
import data = require('./data.json');
import { mapObjectToSchema } from '../mapper';

describe('mapper tests', () => {

    test('mapper maps object to schema correctly', () => {

        expect(mapObjectToSchema(data)).toMatchSnapshot('inputDataMapper');
    });

})