import { useTimeZoneConversion } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Card,
    IconArrowRight16,
    IconApps16,
    IconClock16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../../app-context/index.js'
import { getNaturalCapitalization } from '../../../utils/helpers.js'
import styles from './items-list.module.css'

const IconTextItem = ({ icon, text }) => (
    <div className={styles.iconText}>
        <div className={styles.icon}>{icon}</div>
        <div>{text}</div>
    </div>
)

IconTextItem.propTypes = {
    icon: PropTypes.node,
    text: PropTypes.string,
}

const AggregateDataExchangeCard = ({ ade }) => {
    const { fromServerDate } = useTimeZoneConversion()
    const createdClient = fromServerDate(ade?.created)
    return (
        <div className={styles.cardContainer}>
            <Card key={ade.id} className={styles.cardContainerInner}>
                <div className={styles.exchangeTitle}>{ade.displayName}</div>
                <div className={styles.detailsContainer}>
                    <IconTextItem
                        icon={<IconArrowRight16 />}
                        text={getNaturalCapitalization(ade.target?.type)}
                    />
                    <IconTextItem
                        icon={<IconApps16 />}
                        text={i18n.t('{{numberOfRequests}} requests', {
                            numberOfRequests: ade.source.requests,
                        })}
                    />
                    <IconTextItem
                        icon={<IconClock16 />}
                        text={i18n.t('Created {{createdDate}}', {
                            createdDate: createdClient
                                .getClientZonedISOString()
                                .substring(0, 10),
                        })}
                    />
                </div>
                <div>
                    <ButtonStrip>
                        <Link to={`/edit/${ade.id}`}>
                            <Button small>{i18n.t('Edit')}</Button>
                        </Link>
                        <Button destructive secondary small>
                            {i18n.t('Delete')}
                        </Button>
                    </ButtonStrip>
                </div>
            </Card>
        </div>
    )
}

AggregateDataExchangeCard.propTypes = {
    ade: PropTypes.object,
}

export const EditItemsList = () => {
    const { aggregateDataExchanges } = useAppContext()
    return (
        <div className={styles.listContainer}>
            {aggregateDataExchanges.map((ade) => (
                <AggregateDataExchangeCard key={ade.id} ade={ade} />
            ))}
        </div>
    )
}
