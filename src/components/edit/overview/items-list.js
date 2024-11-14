import {
    useDataMutation,
    useTimeZoneConversion,
    useConfig,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Card,
    IconArrowRight16,
    IconApps16,
    IconClock16,
    InputField,
    SharingDialog,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext, useUserContext } from '../../../context/index.js'
import { getNaturalCapitalization } from '../../../utils/helpers.js'
import { DeleteConfirmation } from './delete-confirmation.js'
import styles from './items-list.module.css'

export const getCreatedDateString = ({
    fromServerDate,
    createdDate,
    dateFormat = 'yyyy-mm-dd',
}) => {
    const createdClient = fromServerDate(createdDate)
    const createdClientDate = new Date(createdClient.getClientZonedISOString())
    const year = String(createdClientDate.getUTCFullYear())
    const month = String(createdClientDate.getUTCMonth() + 1)
    const day = String(createdClientDate.getUTCDate())

    if (dateFormat === 'dd-mm-yyyy') {
        return `${day.padStart(2, '0')}-${month.padStart(
            2,
            '0'
        )}-${year.padStart(4, '0')}`
    }

    return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
    )}`
}

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

const deleteExchangeQuery = {
    resource: 'aggregateDataExchanges',
    type: 'delete',
    id: ({ id }) => id,
}

const AggregateDataExchangeCard = React.memo(({ ade }) => {
    const navigate = useNavigate()
    const { refetchExchanges } = useAppContext()
    const [deleteExchange, { loading: deleting }] = useDataMutation(
        deleteExchangeQuery,
        {
            variables: { id: ade.id },
            onComplete: async () => {
                await refetchExchanges()
                navigate('/edit')
            },
        }
    )
    const { canAddExchange, canDeleteExchange, keyUiLocale } = useUserContext()
    const { systemInfo = {} } = useConfig()
    const { dateFormat } = systemInfo

    const { fromServerDate } = useTimeZoneConversion()
    const createdClientDateString = getCreatedDateString({
        fromServerDate,
        createdDate: ade.created,
        dateFormat,
        keyUiLocale,
    })

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [sharingSettingsOpen, setSharingSettingsOpen] = useState(false)
    const closeDeleteConfirmation = useCallback(
        () => setDeleteConfirmationOpen(false),
        [setDeleteConfirmationOpen]
    )

    const canShareExchange = ade.access?.write && canAddExchange

    return (
        <div className={styles.cardContainer} data-test="data-exchange-card">
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
                            interpolation: { escapeValue: false },
                        })}
                    />
                    <IconTextItem
                        icon={<IconClock16 />}
                        text={i18n.t('Created {{- createdDate}}', {
                            createdDate: createdClientDateString,
                        })}
                    />
                </div>
                <div>
                    <ButtonStrip>
                        {canAddExchange && (
                            <Link to={`/edit/${ade.id}`}>
                                <Button small>{i18n.t('Edit')}</Button>
                            </Link>
                        )}
                        {canDeleteExchange && (
                            <Button
                                destructive
                                secondary
                                small
                                onClick={() => {
                                    setDeleteConfirmationOpen(true)
                                }}
                                loading={deleting}
                            >
                                {deleting
                                    ? i18n.t('Deleting...')
                                    : i18n.t('Delete')}
                            </Button>
                        )}
                        {canShareExchange && (
                            <Button
                                secondary
                                small
                                onClick={() => {
                                    setSharingSettingsOpen(true)
                                }}
                            >
                                {i18n.t('Sharing')}
                            </Button>
                        )}
                    </ButtonStrip>
                </div>
            </Card>
            <DeleteConfirmation
                open={deleteConfirmationOpen}
                onClose={closeDeleteConfirmation}
                onDelete={deleteExchange}
            />
            {sharingSettingsOpen && (
                <SharingDialog
                    id={ade.id}
                    onClose={() => {
                        setSharingSettingsOpen(false)
                    }}
                    type={'aggregateDataExchange'}
                    dataSharing={true}
                />
            )}
        </div>
    )
})

AggregateDataExchangeCard.propTypes = {
    ade: PropTypes.object,
}

export const EditItemsList = () => {
    const { aggregateDataExchanges } = useAppContext()
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <>
            <div className={styles.searchContainer}>
                <InputField
                    placeholder={i18n.t('Search for an exchange')}
                    value={searchTerm}
                    onChange={({ value }) => {
                        setSearchTerm(value)
                    }}
                />
            </div>
            <div className={styles.listContainer}>
                {aggregateDataExchanges
                    .filter(({ displayName }) =>
                        searchTerm.length < 1
                            ? true
                            : displayName
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                    )
                    .map((ade) => (
                        <AggregateDataExchangeCard key={ade.id} ade={ade} />
                    ))}
            </div>
        </>
    )
}
