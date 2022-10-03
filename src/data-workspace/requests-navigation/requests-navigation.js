import { TabBar, Tab } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const RequestsNavigation = ({ requests, selected, onChange }) =>
    requests && requests?.length > 0 ? (
        <TabBar scrollable>
            {requests.map((request) => (
                <Tab
                    key={request.name}
                    onClick={() => onChange(request.name)}
                    selected={request.name === selected}
                >
                    {request.name}
                </Tab>
            ))}
        </TabBar>
    ) : null

RequestsNavigation.propTypes = {
    onChange: PropTypes.func.isRequired,
    requests: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
        })
    ),
    selected: PropTypes.string,
}

export { RequestsNavigation }
