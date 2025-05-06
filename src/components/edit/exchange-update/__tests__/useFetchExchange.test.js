import { getMetadataByRequest } from '../useFetchExchange.js'

const MOCK_ENGINE = {
    query: (_, variables) => ({ query: 'query_name', variables }),
}

describe('getMetadataByRequest', () => {
    it('chunks dx items', () => {
        const MOCK_VARIABLES = {
            dx: [
                'dx_01',
                'dx_02',
                'dx_03',
                'dx_04',
                'dx_05',
                'dx_06',
                'dx_07',
                'dx_08',
            ],
            pe: ['pe_01', 'pe_02'],
            ou: ['ou_01', 'ou_02', 'ou_03'],
        }

        const result = getMetadataByRequest({
            engine: MOCK_ENGINE,
            variables: MOCK_VARIABLES,
            index: 1,
            chunkSize: 5,
        })

        const EXPECTED = [
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_01', 'ou_02', 'ou_03'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01', 'dx_02', 'dx_03', 'dx_04', 'dx_05'],
                            ou: ['ou_01'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_06', 'dx_07', 'dx_08'],
                            ou: ['ou_01'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_01'],
                            pe: ['pe_01', 'pe_02'],
                        },
                    },
                },
                index: 1,
            },
        ]
        expect(result).toEqual(EXPECTED)
    }),
        it('chunks ou items', () => {
            const MOCK_VARIABLES = {
                dx: ['dx_01', 'dx_02', 'dx_03', 'dx_04'],
                pe: ['pe_01', 'pe_02'],
                ou: [
                    'ou_01',
                    'ou_02',
                    'ou_03',
                    'ou_04',
                    'ou_05',
                    'ou_06',
                    'ou_07',
                    'ou_08',
                    'ou_09',
                    'ou_10',
                    'ou_11',
                    'ou_12',
                ],
            }

            const result = getMetadataByRequest({
                engine: MOCK_ENGINE,
                variables: MOCK_VARIABLES,
                index: 1,
                chunkSize: 5,
            })

            const EXPECTED = [
                {
                    request: {
                        query: 'query_name',
                        variables: {
                            variables: {
                                dx: ['dx_01'],
                                ou: [
                                    'ou_01',
                                    'ou_02',
                                    'ou_03',
                                    'ou_04',
                                    'ou_05',
                                ],
                                pe: ['pe_01'],
                            },
                        },
                    },
                    index: 1,
                },
                {
                    request: {
                        query: 'query_name',
                        variables: {
                            variables: {
                                dx: ['dx_01'],
                                ou: [
                                    'ou_06',
                                    'ou_07',
                                    'ou_08',
                                    'ou_09',
                                    'ou_10',
                                ],
                                pe: ['pe_01'],
                            },
                        },
                    },
                    index: 1,
                },
                {
                    request: {
                        query: 'query_name',
                        variables: {
                            variables: {
                                dx: ['dx_01'],
                                ou: ['ou_11', 'ou_12'],
                                pe: ['pe_01'],
                            },
                        },
                    },
                    index: 1,
                },
                {
                    request: {
                        query: 'query_name',
                        variables: {
                            variables: {
                                dx: ['dx_01', 'dx_02', 'dx_03', 'dx_04'],
                                ou: ['ou_01'],
                                pe: ['pe_01'],
                            },
                        },
                    },
                    index: 1,
                },
                {
                    request: {
                        query: 'query_name',
                        variables: {
                            variables: {
                                dx: ['dx_01'],
                                ou: ['ou_01'],
                                pe: ['pe_01', 'pe_02'],
                            },
                        },
                    },
                    index: 1,
                },
            ]
            expect(result).toEqual(EXPECTED)
        })
    it('chunks mix of items', () => {
        const MOCK_VARIABLES = {
            dx: ['dx_01', 'dx_02', 'dx_03', 'dx_04', 'dx_05', 'dx_06', 'dx_07'],
            pe: [
                'pe_01',
                'pe_02',
                'pe_03',
                'pe_04',
                'pe_05',
                'pe_06',
                'pe_07',
                'pe_08',
                'pe_09',
            ],
            ou: [
                'ou_01',
                'ou_02',
                'ou_03',
                'ou_04',
                'ou_05',
                'ou_06',
                'ou_07',
                'ou_08',
                'ou_09',
                'ou_10',
                'ou_11',
                'ou_12',
            ],
        }

        const result = getMetadataByRequest({
            engine: MOCK_ENGINE,
            variables: MOCK_VARIABLES,
            index: 1,
            chunkSize: 5,
        })

        const EXPECTED = [
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_01', 'ou_02', 'ou_03', 'ou_04', 'ou_05'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_06', 'ou_07', 'ou_08', 'ou_09', 'ou_10'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_11', 'ou_12'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01', 'dx_02', 'dx_03', 'dx_04', 'dx_05'],
                            ou: ['ou_01'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_06', 'dx_07'],
                            ou: ['ou_01'],
                            pe: ['pe_01'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_01'],
                            pe: ['pe_01', 'pe_02', 'pe_03', 'pe_04', 'pe_05'],
                        },
                    },
                },
                index: 1,
            },
            {
                request: {
                    query: 'query_name',
                    variables: {
                        variables: {
                            dx: ['dx_01'],
                            ou: ['ou_01'],
                            pe: ['pe_06', 'pe_07', 'pe_08', 'pe_09'],
                        },
                    },
                },
                index: 1,
            },
        ]
        expect(result).toEqual(EXPECTED)
    })
})
