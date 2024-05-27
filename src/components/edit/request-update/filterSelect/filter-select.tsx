import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import DimensionFilterRow from './dimension-filter-row.js'
import styles from './filter-select.module.css'

export const FilterSelect = ({ input }) => {
    const { value, onChange } = input
    const [dimensions, setDimensions] = useState(() => value)
    const addDimensionFilter = useCallback(() => {
        setDimensions((prevDimensions) => [
            ...prevDimensions,
            { dimension: null },
        ])
    }, [setDimensions])

    const changeDimensionFilter = useCallback(
        (index, filter) => {
            setDimensions((prevDimensions) => [
                ...prevDimensions.slice(0, index),
                filter,
                ...prevDimensions.slice(index + 1),
            ])
        },
        [setDimensions]
    )

    const removeDimensionFilter = useCallback(
        (index) => {
            setDimensions((prevDimensions) => [
                ...prevDimensions.slice(0, index),
                ...prevDimensions.slice(index + 1),
            ])
        },
        [setDimensions]
    )

    useEffect(() => {
        onChange(dimensions)
    }, [onChange, dimensions])

    return (
        <div className={styles.dimensionFilter}>
            {dimensions.map((item, index) => (
                <DimensionFilterRow
                    key={index}
                    index={index}
                    onChange={changeDimensionFilter}
                    onRemove={removeDimensionFilter}
                    {...item}
                />
            ))}
            <div className={styles.addFilter}>
                <Button small basic onClick={() => addDimensionFilter()}>
                    {i18n.t('Add filter')}
                </Button>
            </div>
        </div>
    )
}

FilterSelect.propTypes = {
    dimensions: PropTypes.array,
    input: PropTypes.object,
}
