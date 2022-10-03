import PropTypes from 'prop-types'
import React from 'react'
import classes from './layout.module.css'

const LayoutSection = ({ children, className }) => (
    <div className={className}>{children}</div>
)

LayoutSection.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}

const Container = (props) => (
    <LayoutSection {...props} className={classes.container} />
)
const Top = (props) => <LayoutSection {...props} className={classes.top} />
const Content = (props) => (
    <LayoutSection {...props} className={classes.content} />
)
const Bottom = (props) => (
    <LayoutSection {...props} className={classes.bottom} />
)

export const Layout = {
    Container,
    Top,
    Content,
    Bottom,
}
