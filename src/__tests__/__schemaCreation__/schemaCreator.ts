import data from './data.json';
import { mapObjectToSchema } from '../../schemaCreator';

describe('map object to schema tests', () => {

    test('mapper creates a schema that encompases all data from multiple results', () => {
        const createdSchema = data.info.reduce(
            (accSchema, object) => mapObjectToSchema(object, accSchema),
            {}
        )
        expect(createdSchema).toMatchSnapshot()
    })

})
