import { CssVariables } from '@dhis2/ui'
import React, { useState } from 'react'
import { AppProvider } from '../app-context/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { ExchangeProvider } from '../exchange-context/index.js'
import { SubmitModal } from '../submit-modal/index.js'
import { TopBar } from '../top-bar/index.js'
import { Layout } from './layout.js'

const App = () => {
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const closeSubmitModal = () => {
        setSubmitModalOpen(false)
    }
    const openSubmitModal = () => {
        setSubmitModalOpen(Math.random())
    }
    return (
        <>
            <CssVariables spacers colors theme />
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
                            />
                        </Layout.Content>
                        <Layout.Bottom>
                            <BottomBar openSubmitModal={openSubmitModal} />
                        </Layout.Bottom>
                    </ExchangeProvider>
                </Layout.Container>
            </AppProvider>
        </>
    )
}

export { App }
