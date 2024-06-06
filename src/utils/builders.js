import { faker } from '@faker-js/faker'

const randomValueIn = (list) =>
    list[faker.number.int({ min: 0, max: list.length - 1 })]

export const testDataExchange = ({
    id = faker.string.uuid(),
    displayName = faker.company.name(),
    requests = faker.number.int({ min: 1, max: 5 }),
    targetType = randomValueIn(['INTERNAL', 'EXTERNAL']),
    writeMetadataAccess = faker.datatype.boolean(),
    readMetadataAccess = faker.datatype.boolean(),
    writeDataAccess = faker.datatype.boolean(),
    readDataAccess = faker.datatype.boolean(),
    created = faker.date.recent(),
} = {}) => ({
    id,
    displayName,
    source: { requests },
    target: { type: targetType },
    access: {
        write: writeMetadataAccess,
        read: readMetadataAccess,
        data: { write: writeDataAccess, read: readDataAccess },
    },
    created,
})

export const testUserContext = ({
    id = faker.string.uuid(),
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
