import { cleanUpRequests } from '../getExchangeValues.js'

describe('cleanUpRequests', () => {
    it('removes irrelevant properties', () => {
        const originalRequests = [
            {
                name: 'a name',
                visualization: 'a visualization',
                dx: [],
                pe: [],
                ou: [],
                filters: [],
                inputIdScheme: 'UID',
                outputDataElementIdScheme: 'UID',
                outputOrgUnitIdScheme: 'UID',
                outputIdScheme: 'UID',
                outputDataItemIdScheme: 'UID',
                dhis2: [],
                team: 'platform',
            },
        ]
        const expectedRequests = [
            {
                name: 'a name',
                visualization: 'a visualization',
                dx: [],
                pe: [],
                ou: [],
                filters: [],
                inputIdScheme: 'UID',
                outputDataElementIdScheme: 'UID',
                outputOrgUnitIdScheme: 'UID',
                outputIdScheme: 'UID',
                outputDataItemIdScheme: 'UID',
            },
        ]
        expect(cleanUpRequests({ requests: originalRequests })).toEqual(
            expectedRequests
        )
    })

    it('only returns properties that are not null or undefined on the original', () => {
        const originalRequests = [{ dx: [], pe: undefined }]
        const expectedRequests = [{ dx: [] }]
        expect(cleanUpRequests({ requests: originalRequests })).toEqual(
            expectedRequests
        )
    })

    it('removes ID schemes of value NONE (outputDataElementIdScheme, outputOrgUnitIdScheme, outputDataItemIdScheme)', () => {
        const originalRequests = [
            {
                dx: [],
                outputDataElementIdScheme: 'NONE',
                outputOrgUnitIdScheme: 'NONE',
                outputDataItemIdScheme: 'NONE',
            },
        ]
        const expectedRequests = [{ dx: [] }]
        expect(cleanUpRequests({ requests: originalRequests })).toEqual(
            expectedRequests
        )
    })
})
