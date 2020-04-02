
import data = require('./data.json');
import { mapObjectToSchema } from '../schemaCreator';

describe('mapper tests', () => {

    test('mapper maps object to schema correctly', () => {

        expect(mapObjectToSchema(data)).toMatchSnapshot('inputDataMapper 1')
    });

})