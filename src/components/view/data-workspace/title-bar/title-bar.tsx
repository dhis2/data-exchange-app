import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconInfo16, IconDimensionDataSet16, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import React from 'react'
import { useExchangeContext } from '../../../../context/index'
import styles from './title-bar.module.css'

const getRelativeTimeDifference = ({ startTimestamp, endTimestamp }) => {
    if (!startTimestamp || !endTimestamp) {
        return undefined
    }
    const startTime = new Date(startTimestamp)
    const endTime = new Date(endTimestamp)

    return moment(startTime).fromNow(endTime)
}

// this formats to the styling specified by DHIS2 design principles
const formatTimestamp = ({ timestamp, timezone }) => {
    return `${timestamp.substring(0, 10)} T ${timestamp.substring(
        11,
        16
    )} ${timezone}`
}

const TitleBar = () => {
    const { systemInfo } = useConfig()
    const { lastAnalyticsTableSuccess, serverDate, serverTimeZoneId } =
        systemInfo
    const { exchange } = useExchangeContext()
    const requestsCount = exchange.source?.requests?.length

    return (
        <div className={styles.titleBar}>
            <span className={styles.workflowName}>{exchange?.displayName}</span>
            <span className={styles.workflowDataSetsCount}>
                <IconDimensionDataSet16 />
                {requestsCount === 1 &&
                    i18n.t('1 data report', {
                        requestsCount,
                    })}

                {requestsCount > 1 &&
                    i18n.t('{{requestsCount}} data reports', {
                        requestsCount,
                    })}
            </span>
            <div className={styles.analyticsRunStamp}>
                <IconInfo16 />
                <div>
                    <Tooltip
                        content={formatTimestamp({
                            timestamp: lastAnalyticsTableSuccess,
                            timezone: serverTimeZoneId,
                        })}
                    >
                        <span>
                            {i18n.t(
                                'Source data was generated {{timeDifference}} ago',
                                {
                                    timeDifference: getRelativeTimeDifference({
                                        startTimestamp:
                                            lastAnalyticsTableSuccess,
                                        endTimestamp: serverDate,
                                    }),
                                }
                            )}
                        </span>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export { TitleBar }
