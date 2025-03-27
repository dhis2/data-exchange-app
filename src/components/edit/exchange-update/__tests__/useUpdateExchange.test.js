import { getJsonPatch } from '../useUpdateExchange.js'

describe('getJsonPatch', () => {
    it('creates individual patch values for target, api, and grouped patch for request (basic)', () => {
        const FORMATTED_VALUES = {
            name: 'new name external',
            target: {
                type: 'EXTERNAL',
                request: {
                    idScheme: 'CODE',
                    dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                    categoryOptionComboIdScheme: 'UID',
                    skipAudit: true,
                    dryRun: false,
                    importStrategy: 'UPDATE',
                },
                api: {
                    url: 'http://www.external.dhis2.org',
                    username: 'new_username',
                    password: 'new_password',
                },
            },
            source: {
                requests: [
                    {
                        name: 'cat',
                        dx: ['fbfJHSPpUQD'],
                        pe: ['LAST_MONTH'],
                        ou: ['fdc6uOvgoji'],
                        filters: [],
                        inputIdScheme: 'UID',
                        outputIdScheme: 'UID',
                    },
                ],
            },
        }

        const dirtyFields = {
            name: true,
            url: true,
            username: true,
            password: true,
            target_idScheme: true,
            target_dataElementIdScheme: true,
            target_orgUnitIdScheme: true,
            target_dataElementIdScheme_attribute: true,
            dryRun: true,
            importStrategy: true,
        }
        const FORM = {
            getState: () => ({
                dirtyFields,
            }),
        }

        const results = getJsonPatch({
            formattedValues: FORMATTED_VALUES,
            form: FORM,
            requestsTouched: false,
        })

        const expected = [
            { op: 'add', path: '/name', value: 'new name external' },
            {
                op: 'add',
                path: '/target/api/url',
                value: 'http://www.external.dhis2.org',
            },
            { op: 'add', path: '/target/api/username', value: 'new_username' },
            { op: 'add', path: '/target/api/password', value: 'new_password' },
            { op: 'remove', path: '/target/api/accessToken' },
            {
                op: 'add',
                path: '/target/request',
                value: {
                    idScheme: 'CODE',
                    dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                    categoryOptionComboIdScheme: 'UID',
                    skipAudit: true,
                    dryRun: false,
                    importStrategy: 'UPDATE',
                },
            },
        ]
        expect(results).toEqual(expected)
    })

    it('creates individual patch values for target, api, and grouped patch for request (pat)', () => {
        const FORMATTED_VALUES = {
            name: 'new name external',
            target: {
                type: 'EXTERNAL',
                request: {
                    idScheme: 'CODE',
                    dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                    categoryOptionComboIdScheme: 'UID',
                    skipAudit: true,
                    dryRun: false,
                    importStrategy: 'UPDATE',
                },
                api: {
                    url: 'http://www.external.dhis2.org',
                    accessToken: 'new_access_token',
                    authentication: 'PAT',
                },
            },
            source: {
                requests: [
                    {
                        name: 'cat',
                        dx: ['fbfJHSPpUQD'],
                        pe: ['LAST_MONTH'],
                        ou: ['fdc6uOvgoji'],
                        filters: [],
                        inputIdScheme: 'UID',
                        outputIdScheme: 'UID',
                    },
                ],
            },
        }

        const dirtyFields = {
            name: true,
            url: true,
            accessToken: true,
            target_idScheme: true,
            target_dataElementIdScheme: true,
            target_orgUnitIdScheme: true,
            target_dataElementIdScheme_attribute: true,
            dryRun: true,
            importStrategy: true,
        }
        const FORM = {
            getState: () => ({
                dirtyFields,
            }),
        }

        const results = getJsonPatch({
            formattedValues: FORMATTED_VALUES,
            form: FORM,
            requestsTouched: false,
        })

        const expected = [
            { op: 'add', path: '/name', value: 'new name external' },
            {
                op: 'add',
                path: '/target/api/url',
                value: 'http://www.external.dhis2.org',
            },
            {
                op: 'add',
                path: '/target/api/accessToken',
                value: 'new_access_token',
            },
            { op: 'remove', path: '/target/api/username' },
            { op: 'remove', path: '/target/api/password' },
            {
                op: 'add',
                path: '/target/request',
                value: {
                    idScheme: 'CODE',
                    dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                    categoryOptionComboIdScheme: 'UID',
                    skipAudit: true,
                    dryRun: false,
                    importStrategy: 'UPDATE',
                },
            },
        ]
        expect(results).toEqual(expected)
    })

    it('creates ngrouped patch when changing type (pat)', () => {
        const FORMATTED_VALUES = {
            name: 'newly made external',
            target: {
                type: 'EXTERNAL',
                request: {
                    idScheme: 'CODE',
                    dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                    categoryOptionComboIdScheme: 'UID',
                    skipAudit: true,
                    dryRun: false,
                    importStrategy: 'UPDATE',
                },
                api: {
                    url: 'http://www.external.dhis2.org',
                    accessToken: 'new_access_token',
                    authentication: 'PAT',
                },
            },
            source: {
                requests: [
                    {
                        name: 'cat',
                        dx: ['fbfJHSPpUQD'],
                        pe: ['LAST_MONTH'],
                        ou: ['fdc6uOvgoji'],
                        filters: [],
                        inputIdScheme: 'UID',
                        outputIdScheme: 'UID',
                    },
                ],
            },
        }

        const dirtyFields = {
            name: true,
            url: true,
            accessToken: true,
            target_idScheme: true,
            target_dataElementIdScheme: true,
            target_orgUnitIdScheme: true,
            target_dataElementIdScheme_attribute: true,
            dryRun: true,
            importStrategy: true,
            type: true,
        }
        const FORM = {
            getState: () => ({
                dirtyFields,
            }),
        }

        const results = getJsonPatch({
            formattedValues: FORMATTED_VALUES,
            form: FORM,
            requestsTouched: false,
        })

        const expected = [
            { op: 'add', path: '/name', value: 'newly made external' },

            {
                op: 'add',
                path: '/target',
                value: {
                    api: {
                        accessToken: 'new_access_token',
                        url: 'http://www.external.dhis2.org',
                    },
                    request: {
                        idScheme: 'CODE',
                        dataElementIdScheme: 'ATTRIBUTE:l1VmqIHKk6t',
                        categoryOptionComboIdScheme: 'UID',
                        skipAudit: true,
                        dryRun: false,
                        importStrategy: 'UPDATE',
                    },
                    type: 'EXTERNAL',
                },
            },
        ]
        expect(results).toEqual(expected)
    })
})
