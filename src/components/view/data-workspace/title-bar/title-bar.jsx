import { useConfig, useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconInfo16, IconDimensionDataSet16, Tooltip } from '@dhis2/ui'
import moment from 'moment'
import React from 'react'
import { useExchangeContext } from '../../../../context/index.js'
import styles from './title-bar.module.css'

export const getRelativeTimeDifference = ({ startTimeDate }) => {
    if (!startTimeDate) {
        return undefined
    }

    return moment(startTimeDate).fromNow(true)
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
    const { lastAnalyticsTableSuccess, serverTimeZoneId } = systemInfo
    const { exchange } = useExchangeContext()
    const { fromServerDate } = useTimeZoneConversion()
    const lastAnalyticsTableSuccessClient = fromServerDate(
        lastAnalyticsTableSuccess
    )
    const requestsCount = exchange.source?.requests?.length

    return (
        <div className={styles.titleBar} data-test="title-bar">
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
                                        startTimeDate:
                                            lastAnalyticsTableSuccessClient,
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
