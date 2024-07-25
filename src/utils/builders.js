import { faker } from '@faker-js/faker'

const randomValueIn = (list) =>
    list[faker.number.int({ min: 0, max: list.length - 1 })]

export const randomDhis2Id = () =>
    faker.helpers.fromRegExp(/[a-zA-Z]{1}[a-zA-Z0-9]{10}/)

export const testRequest = ({ name = faker.word.noun() } = {}) => ({
    name,
})

export const testDataExchange = ({
    id = randomDhis2Id(),
    displayName = faker.company.name(),
    requests = [testRequest()],
    targetType = randomValueIn(['INTERNAL', 'EXTERNAL']),
    writeMetadataAccess = faker.datatype.boolean(),
    readMetadataAccess = faker.datatype.boolean(),
    writeDataAccess = faker.datatype.boolean(),
    readDataAccess = faker.datatype.boolean(),
    created = faker.date.recent(),
    externalURL = undefined,
} = {}) => ({
    id,
    displayName,
    source: { requests },
    target: { type: targetType, api: { url: externalURL } },
    access: {
        write: writeMetadataAccess,
        read: readMetadataAccess,
        data: { write: writeDataAccess, read: readDataAccess },
    },
    created,
})

export const testUserContext = ({
    id = randomDhis2Id(),
    canAddExchange = faker.datatype.boolean(),
    canDeleteExchange = faker.datatype.boolean(),
    organisationUnits = [],
    keyUiLocale = 'en',
} = {}) => ({
    id,
    canAddExchange,
    canDeleteExchange,
    organisationUnits,
    keyUiLocale,
})

export const addOnlyPermissionsUserContext = () =>
    testUserContext({
        canAddExchange: true,
        canDeleteExchange: false,
    })

export const noPermissionsUserContext = () =>
    testUserContext({
        canAddExchange: false,
        canDeleteExchange: false,
    })

export const allPermissionsUserContext = () =>
    testUserContext({
        canAddExchange: true,
        canDeleteExchange: true,
    })

const testHeaders = [
    {
        name: 'dx',
        column: 'Data',
        valueType: 'TEXT',
        type: 'java.lang.String',
        hidden: false,
        meta: true,
    },
    {
        name: 'pe',
        column: 'Period',
        valueType: 'TEXT',
        type: 'java.lang.String',
        hidden: false,
        meta: true,
    },
    {
        name: 'ou',
        column: 'Organisation unit',
        valueType: 'TEXT',
        type: 'java.lang.String',
        hidden: false,
        meta: true,
    },
    {
        name: 'value',
        column: 'Value',
        valueType: 'NUMBER',
        type: 'java.lang.Double',
        hidden: false,
        meta: false,
    },
]

const testItems = {
    202307: { name: 'July 2023' },
    202308: { name: 'August 2023' },
    202309: { name: 'September 2023' },
    MAs88nJc9nL: { name: 'Private Clinic' },
    LAST_12_MONTHS: { name: 'Last 12 months' },
    ImspTQPwCqd: { name: 'Sierra Leone' },
    dx: { name: 'Data' },
    pq2XI5kz2BY: { name: 'Fixed' },
    PT59n8BQbqM: { name: 'Outreach' },
    ou: { name: 'Organisation unit' },
    fbfJHSPpUQD: { name: 'ANC 1st visit' },
    pe: { name: 'Period' },
    cYeuwXTCPkU: { name: 'ANC 2nd visit' },
    oRVt7g429ZO: { name: 'Public facilities' },
    Bpx0589u8y0: { name: 'Facility Ownership' },
}

const testDimensions = {
    dx: ['fbfJHSPpUQD', 'cYeuwXTCPkU'],
    pe: ['202307', '202308', '202309'],
    ou: ['ImspTQPwCqd'],
    co: ['pq2XI5kz2BY', 'PT59n8BQbqM'],
    Bpx0589u8y0: ['oRVt7g429ZO', 'MAs88nJc9nL'],
}

const testRows = [
    ['fbfJHSPpUQD', '202308', 'ImspTQPwCqd', '21050'],
    ['cYeuwXTCPkU', '202308', 'ImspTQPwCqd', '19638'],
    ['fbfJHSPpUQD', '202307', 'ImspTQPwCqd', '21438'],
    ['cYeuwXTCPkU', '202307', 'ImspTQPwCqd', '21438'],
    ['fbfJHSPpUQD', '202309', 'ImspTQPwCqd', '21476'],
    ['cYeuwXTCPkU', '202309', 'ImspTQPwCqd', '21476'],
]

export const testDataExchangeSourceData = ({
    headers = testHeaders,
    items = testItems,
    dimensions = testDimensions,
    rows = testRows,
} = {}) => ({
    headers,
    metaData: {
        items,
        dimensions,
    },
    rowContext: {},
    width: 4,
    rows,
    height: 36,
    headerWidth: 4,
})

export const testAttribute = ({
    id = randomDhis2Id(),
    displayName = faker.word.adjective(),
} = {}) => ({
    displayName,
    id,
})

export const testImportSummary = ({
    imported = faker.number.int(),
    updated = faker.number.int(),
    ignored = faker.number.int(),
    deleted = faker.number.int(),
    status = 'SUCCESS',
    conflicts = [],
} = {}) => ({
    importCount: {
        imported,
        updated,
        ignored,
        deleted,
    },
    conflicts,
    status,
})
