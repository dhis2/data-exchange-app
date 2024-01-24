import React, { useState } from 'react'
import { BottomBar } from '../components/view/bottom-bar/index.js'
import { Layout } from '../components/view/data-layout/layout.js'
import { DataWorkspace } from '../components/view/data-workspace/index.js'
import { SubmitModal } from '../components/view/submit-modal/index.js'
import { TopBar } from '../components/view/top-bar/index.js'
import { ExchangeProvider } from '../context/exchange-context/index.js'

export const DataPage = () => {
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const [dataSubmitted, setDataSubmitted] = useState(null)

    const closeSubmitModal = () => {
        setSubmitModalOpen(false)
    }
    const openSubmitModal = () => {
        setSubmitModalOpen(true)
    }

    return (
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
    )
}
