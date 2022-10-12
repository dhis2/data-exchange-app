import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { AppProvider } from '../app-context/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { ExchangeProvider } from '../exchange-context/index.js'
import { SubmitModal } from '../submit-modal/index.js'
import { TopBar } from '../top-bar/index.js'
import { Layout } from './layout.js'

const App = ({ router: Router }) => {
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const [dataSubmitted, setDataSubmitted] = useState(null)

    const closeSubmitModal = () => {
        setSubmitModalOpen(false)
    }
    const openSubmitModal = () => {
        setSubmitModalOpen(true)
    }
    return (
        <>
            <CssVariables spacers colors theme />
            <Router>
                <QueryParamProvider
                    adapter={ReactRouter6Adapter}
                    ReactRouterRoute={Route}
                >
                    <AppProvider>
                        <Layout.Container>
                            <Layout.Top>
                                <TopBar />
                            </Layout.Top>
                            <ExchangeProvider>
                                <Layout.Content>
                                    <DataWorkspace />
                                    <SubmitModal
                                        open={submitModalOpen}
                                        onClose={closeSubmitModal}
                                        setDataSubmitted={setDataSubmitted}
                                    />
                                </Layout.Content>
                                <Layout.Bottom>
                                    <BottomBar
                                        openSubmitModal={openSubmitModal}
                                        dataSubmitted={dataSubmitted}
                                    />
                                </Layout.Bottom>
                            </ExchangeProvider>
                        </Layout.Container>
                    </AppProvider>
                </QueryParamProvider>
            </Router>
        </>
    )
}

App.defaultProps = {
    router: HashRouter,
}

App.propTypes = {
    router: PropTypes.elementType,
}

// wrapper so we can use a different router in tests
const AppWrapper = () => {
    return <App />
}

export { AppWrapper }
