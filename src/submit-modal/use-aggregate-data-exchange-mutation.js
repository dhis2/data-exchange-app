import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useEffect, useState } from 'react'

const getMutation = ({ id }) => ({
    resource: `aggregateDataExchanges/${id}/exchange`,
    type: 'create',
})

export const useAggregateDataExchangeMutation = ({ id }) => {
    const engine = useDataEngine()

    const [error, setError] = useState(null)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [called, setCalled] = useState(false)
    const [submitTimestamp, setSubmitTimestamp] = useState(null)
    const [fetch, setFetch] = useState(false)

    const cleanUp = () => {
        setLoading(false)
        setCalled(false)
        setData(null)
        setError(null)
    }

    useEffect(() => {
        const fetchData = async ({ id }) => {
            if (fetch) {
                setError(null)
                setData(null)
                setLoading(true)
                setSubmitTimestamp(null)
                try {
                    const response = await engine.mutate(getMutation({ id }))
                    if (response?.status === 'ERROR') {
                        const errorMessage =
                            response?.importSummaries.find(
                                ({ status }) => status === 'ERROR'
                            )?.description || i18n.t('Unknown error')
                        throw new Error(errorMessage)
                    }
                    setData(response)
                    setSubmitTimestamp(new Date())
                } catch (error) {
                    setError(error)
                } finally {
                    setFetch(false)
                    setCalled(true)
                    setLoading(false)
                }
            }
        }
        fetchData({ id })
    }, [id, fetch, engine])

    // clean up if id changes
    useEffect(() => {
        return () => {
            cleanUp()
            setSubmitTimestamp(null)
        }
    }, [id])

    const refetch = () => {
        setFetch(true)
    }

    return [refetch, { error, data, loading, called, submitTimestamp, cleanUp }]
}
