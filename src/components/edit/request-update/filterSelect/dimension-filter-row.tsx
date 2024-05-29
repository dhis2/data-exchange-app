import PropTypes from 'prop-types'
import React from 'react'
import styles from './dimension-filter-row.module.css'
import DimensionItemsSelect from './dimension-items-select'
import DimensionSelect from './dimension-select'
import RemoveFilter from './remove-filter'

type DimensionFilterRowProps = {
    dimension: string
    items: Array<any>
    index: number
    onChange: (
        id: number,
        { dimension, items }: { dimension: string; items: Array<any> }
    ) => void
    onRemove: (index: number) => void
}
type DimensionFilterRowType = React.FC<DimensionFilterRowProps>

const DimensionFilterRow: DimensionFilterRowType = ({
    dimension,
    items,
    index,
    onChange,
    onRemove,
}) => {
    const onSelect = (dimension, items) => onChange(index, { dimension, items })

    return (
        <div className={styles.filterRow}>
            <DimensionSelect
                dimension={dimension}
                onChange={(selectedDimension) => onSelect(selectedDimension.id)}
            />
            <DimensionItemsSelect
                dimension={dimension}
                value={items ? items.map((item) => item.id) : null}
                onChange={(items) => onSelect(dimension, items)}
            />
            <RemoveFilter onClick={() => onRemove(index)} />
        </div>
    )
}

DimensionFilterRow.propTypes = {
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    dimension: PropTypes.string,
    index: PropTypes.number,
    items: PropTypes.array,
}

export default DimensionFilterRow
