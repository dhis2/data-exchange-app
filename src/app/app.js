import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { AppProvider } from '../app-context/index.js'
import { DataPage, EditPage, EditItem, AddItem } from '../pages/index.js'

const App = ({ router: Router }) => (
    <>
        <CssVariables spacers colors theme />
        <Router>
            <QueryParamProvider
                adapter={ReactRouter6Adapter}
                ReactRouterRoute={Route}
            >
                <AppProvider>
                    <Routes>
                        <Route path="/" element={<DataPage />}></Route>
                        <Route path="/edit" element={<EditPage />}></Route>
                        <Route
                            path="/edit/:exchangeID"
                            element={<EditItem />}
                        ></Route>
                        <Route path="/add" element={<AddItem />}></Route>
                    </Routes>
                </AppProvider>
            </QueryParamProvider>
        </Router>
    </>
)

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
