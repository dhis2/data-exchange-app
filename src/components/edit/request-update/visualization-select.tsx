import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useUserContext } from '../../../context/index'
import { OpenFileDialog } from '../shared/index'
import styles from './visualization-select.module.css'

export const VisualizationSelect = ({ input }) => {
    const [open, setOpen] = useState(false)
    const currentUser = useUserContext()
    const { value: visualizationInfo, onChange } = input
    const { baseUrl } = useConfig()
    const onFileSelect = (selected) => {
        onChange(selected)
        setOpen(false)
    }

    return (
        <div className={styles.visualizationInfoContainer}>
            {visualizationInfo.name && (
                <div className={styles.visualizationLinkTextContainer}>
                    <span className={styles.visualizationLinkText}>
                        {i18n.t('Linked to: ', { nsSeparator: '-:-' })}
                    </span>
                    <span className={styles.visualizationLinkText}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${baseUrl}/dhis-web-data-visualizer/index.html#/${visualizationInfo.id}`}
                        >
                            {visualizationInfo.name}
                        </a>
                    </span>
                </div>
            )}

            <Button
                small
                secondary
                onClick={() => {
                    setOpen(true)
                }}
            >
                {visualizationInfo.id
                    ? i18n.t('Choose a different visualization')
                    : i18n.t('Choose a visualization')}
            </Button>

            <OpenFileDialog
                type="visualization"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                onNew={() => {
                    console.log('Not supported')
                }} // this prop is not relevant, but required
                onFileSelect={onFileSelect}
                currentUser={currentUser}
            />
        </div>
    )
}

VisualizationSelect.propTypes = {
    input: PropTypes.object,
}
