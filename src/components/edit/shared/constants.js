export const SCHEME_TYPES = {
    none: 'NONE',
    uid: 'UID',
    code: 'CODE',
    attribute: 'ATTRIBUTE',
}

export const SCHEME_TYPES_WITH_NONE = {
    uid: 'UID',
    code: 'CODE',
    attribute: 'ATTRIBUTE',
}

export const AUTHENTICATION_TYPES = {
    basic: 'BASIC',
    pat: 'PAT',
}

export const EXCHANGE_TYPES = {
    external: 'EXTERNAL',
    internal: 'INTERNAL',
}

export const OU_GROUP_PREFIX = 'OU_GROUP-'
export const OU_LEVEL_PREFIX = 'LEVEL-'

export const IMPORT_STRATEGY_TYPES = {
    create: 'CREATE',
    update: 'UPDATE',
    create_and_update: 'CREATE_AND_UPDATE',
    delete: 'DELETE',
}

export const IMPORT_STRATEGY_OPTIONS = [
    {
        value: IMPORT_STRATEGY_TYPES.create_and_update,
        prefix: 'Merge',
        label: 'Import new values and update existing',
    },
    {
        value: IMPORT_STRATEGY_TYPES.create,
        prefix: 'Append',
        label: 'Import new values only',
    },
    {
        value: IMPORT_STRATEGY_TYPES.update,
        prefix: 'Update',
        label: 'Only update existing values, ignore new values',
    },
    {
        value: IMPORT_STRATEGY_TYPES.delete,
        prefix: 'Delete',
        label: 'Remove values included in uploaded file',
        type: 'critical',
    },
]
