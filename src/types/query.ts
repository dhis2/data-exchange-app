export type WrapQueryResponse<T, S extends string = 'result'> = {
    [K in S]: T
}
