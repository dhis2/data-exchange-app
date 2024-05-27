import React, { useState } from 'react'
import {
    BottomBar,
    DataWorkspace,
    Layout,
    SubmitModal,
    TopBar,
} from '../components/index.js'
import { ExchangeProvider } from '../context/index.js'

export const DataPage = () => {
    const [submitModalOpen, setSubmitModalOpen] = useState(false)
    const [dataSubmitted, setDataSubmitted] = useState(null)

    const closeSubmitModal = () => {
        setSubmitModalOpen(false)
    }
    const openSubmitModal = () => {
        setSubmitModalOpen(true)
    }

    const [showPreview, setShowPreview] = useState(false)

    return (
        <Layout.Container>
            <Layout.Top>
                <TopBar setShowPreview={setShowPreview} />
            </Layout.Top>
            <ExchangeProvider showPreview={showPreview}>
                <Layout.Content>
                    <DataWorkspace showPreview={showPreview} />
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
