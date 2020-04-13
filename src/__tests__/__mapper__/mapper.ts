import data from './data.json';
import { transformations } from './transformations.json';

import { mapObject } from '../../mapper';
import { Transform } from '../../utils/types';

describe('transform data object into target object according rules in transformations', () => {

    test('creates an object that is the result of applying all transformations on the data object', () => {
        expect(mapObject(data, transformations as Transform[])).toMatchSnapshot()
    })

})
