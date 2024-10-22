import {
    convertToObjectFormat,
    ensureNestedObjectExists,
    formatData,
} from './requests-display.jsx'

describe('convertToObjectFormat', () => {
    it('returns data in expected format', () => {
        const data = {
            rows: [
                ['ou-id-1', 'de-id-1', 'pe-id-1', 1],
                ['ou-id-1', 'de-id-1', 'pe-id-2', 2],
                ['ou-id-1', 'de-id-2', 'pe-id-1', 10],
                ['ou-id-3', 'de-id-2', 'pe-id-2', 100],
            ],
        }
        const objectFormat = convertToObjectFormat({
            data,
            dx_index: 1,
            ou_index: 0,
            pe_index: 2,
            value_index: 3,
        })

        const expectedObject = {
            'ou-id-1': {
                'de-id-1': {
                    'pe-id-1': 1,
                    'pe-id-2': 2,
                },
                'de-id-2': {
                    'pe-id-1': 10,
                },
            },
            'ou-id-3': {
                'de-id-2': {
                    'pe-id-2': 100,
                },
            },
        }
        expect(objectFormat).toEqual(expectedObject)
    })
})

describe('ensureNestedObjectExists', () => {
    it('adds missing properties on object', () => {
        const testObject = {}
        ensureNestedObjectExists(testObject, ['red', 'green', 'blue'])
        ensureNestedObjectExists(testObject, [
            'apple',
            'pear',
            'blueberry',
            'plum',
        ])
        const referenceObject = {
            red: {
                green: {
                    blue: {},
                },
            },
            apple: {
                pear: {
                    blueberry: {
                        plum: {},
                    },
                },
            },
        }

        expect(testObject).toEqual(referenceObject)
    })

    it('does not overwrite properties that already exist', () => {
        const testObject = { red: { apple: { berry: false } } }
        ensureNestedObjectExists(testObject, [
            'red',
            'raspberry',
            'description',
        ])
        ensureNestedObjectExists(testObject, ['red', 'apple', 'description'])
        const referenceObject = {
            red: {
                apple: {
                    berry: false,
                    description: {},
                },
                raspberry: {
                    description: {},
                },
            },
        }

        expect(testObject).toEqual(referenceObject)
    })
})

describe('formatData', () => {
    it('formats in rows, alphabetized by ou,de, and ordered by period', () => {
        const testData = {
            headers: [
                { name: 'ou' },
                { name: 'dx' },
                { name: 'pe' },
                { name: 'value' },
            ],
            metaData: {
                items: {
                    'ou-id-1': { name: 'Wonderland' },
                    'ou-id-3': { name: 'Oz' },
                    'de-id-3': { name: 'Zebras' },
                    'de-id-2': { name: 'Aardvarks' },
                    2000: { name: 'January 2000' },
                    1900: { name: 'January 1900' },
                    filterId: { name: 'filterName' },
                },
                dimensions: {
                    dx: ['de-id-2', 'de-id-3'],
                    pe: ['2000', '1900'],
                    ou: ['ou-id-1', 'ou-id-3'],
                    filterId: 'filterId2',
                },
            },
            rows: [
                ['ou-id-1', 'de-id-2', '2000', 1],
                ['ou-id-1', 'de-id-2', '1900', 2],
                ['ou-id-1', 'de-id-3', '2000', 10],
                ['ou-id-3', 'de-id-3', '1900', 100],
            ],
        }

        const testFormat = formatData(testData)

        const referenceFormat = [
            {
                title: 'Oz - filterName',
                headers: [
                    {
                        name: 'Data',
                    },
                    {
                        name: 'January 1900',
                    },
                    {
                        name: 'January 2000',
                    },
                ],
                rows: [
                    ['Aardvarks', '', ''],
                    ['Zebras', 100, ''],
                ],
            },
            {
                title: 'Wonderland - filterName',
                headers: [
                    {
                        name: 'Data',
                    },
                    {
                        name: 'January 1900',
                    },
                    {
                        name: 'January 2000',
                    },
                ],
                rows: [
                    ['Aardvarks', 2, 1],
                    ['Zebras', '', 10],
                ],
            },
        ]

        expect(testFormat).toEqual(referenceFormat)
    })
})
