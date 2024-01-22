import React, { useState } from 'react'
import { BottomBar } from '../components/bottom-bar/index.js'
import { Layout } from '../components/data-layout/layout.js'
import { DataWorkspace } from '../components/data-workspace/index.js'
import { SubmitModal } from '../components/submit-modal/index.js'
import { TopBar } from '../components/top-bar/index.js'
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
