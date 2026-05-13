// jsdom doesn't implement CSS.supports, but Highcharts calls it at module load time
Object.defineProperty(global, 'CSS', {
    value: { supports: () => true },
})
