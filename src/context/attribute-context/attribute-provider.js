import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader, Warning } from '../../components/shared/index.js'
import { AttributeContext } from './attribute-context.js'

const query = {
    attributes: {
        // This is generic enpoint but will only return
        // exchanges a user is allowed to see
        resource: 'attributes',
        params: {
            paging: false,
            fields: ['id', 'displayName'],
            order: 'displayName:iasc',
        },
    },
}

const AttributeProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query)

    if (loading) {
        return <Loader />
    }

    if (error) {
        /**
         * general error boundary
         */
        return (
            <Warning
                error={true}
                title={i18n.t('Attribute information is not accessible')}
            >
                <span>
                    {i18n.t(
                        'There was a problem retrieving attributes. Refresh the page to try again.'
                    )}
                </span>
            </Warning>
        )
    }

    const { attributes } = data.attributes

    const providerValue = {
        attributes,
    }

    return (
        <AttributeContext.Provider value={providerValue}>
            {children}
        </AttributeContext.Provider>
    )
}

AttributeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AttributeProvider }
