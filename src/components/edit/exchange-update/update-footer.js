import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

export const EditItemFooter = ({ handleSubmit }) => (
    <>
        <ButtonStrip>
            <Button
                type="submit"
                primary
                onClick={() => {
                    handleSubmit()
                }}
            >
                {i18n.t('Save exchange')}
            </Button>
            <Link to="/edit">
                <Button>{i18n.t('Cancel')}</Button>
            </Link>
        </ButtonStrip>
    </>
)

EditItemFooter.propTypes = {
    handleSubmit: PropTypes.func,
}

export const EditRequestFooter = ({
    exitRequestEditMode,
    handleRequestSubmit,
}) => (
    <>
        <ButtonStrip>
            <Button
                type="submit"
                primary
                onClick={() => {
                    handleRequestSubmit()
                    exitRequestEditMode()
                }}
            >
                {i18n.t('Save request')}
            </Button>
            <Button
                onClick={() => {
                    exitRequestEditMode()
                }}
            >
                {i18n.t('Cancel')}
            </Button>
        </ButtonStrip>
    </>
)

EditRequestFooter.propTypes = {
    exitRequestEditMode: PropTypes.func,
    handleRequestSubmit: PropTypes.func,
}
