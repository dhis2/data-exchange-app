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
