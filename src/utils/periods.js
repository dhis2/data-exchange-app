import i18n from '@dhis2/d2-i18n'
import { createFixedPeriodFromPeriodId } from '@dhis2/multi-calendar-dates'

const relativePeriods = {
    TODAY: i18n.t('Today'),
    YESTERDAY: i18n.t('Yesterday'),
    LAST_3_DAYS: i18n.t('Last 3 days'),
    LAST_7_DAYS: i18n.t('Last 7 days'),
    LAST_14_DAYS: i18n.t('Last 14 days'),
    LAST_30_DAYS: i18n.t('Last 30 days'),
    LAST_60_DAYS: i18n.t('Last 60 days'),
    LAST_90_DAYS: i18n.t('Last 90 days'),
    LAST_180_DAYS: i18n.t('Last 180 days'),
    THIS_WEEK: i18n.t('This week'),
    LAST_WEEK: i18n.t('Last week'),
    LAST_4_WEEKS: i18n.t('Last 4 weeks'),
    LAST_12_WEEKS: i18n.t('Last 12 weeks'),
    LAST_52_WEEKS: i18n.t('Last 52 weeks'),
    WEEKS_THIS_YEAR: i18n.t('Weeks this year'),
    THIS_BIWEEK: i18n.t('This bi-week'),
    LAST_BIWEEK: i18n.t('Last bi-week'),
    LAST_4_BIWEEKS: i18n.t('Last 4 bi-weeks'),
    THIS_MONTH: i18n.t('This month'),
    LAST_MONTH: i18n.t('Last month'),
    LAST_3_MONTHS: i18n.t('Last 3 months'),
    LAST_6_MONTHS: i18n.t('Last 6 months'),
    LAST_12_MONTHS: i18n.t('Last 12 months'),
    MONTHS_THIS_YEAR: i18n.t('Months this year'),
    THIS_BIMONTH: i18n.t('This bi-month'),
    LAST_BIMONTH: i18n.t('Last bi-month'),
    LAST_6_BIMONTHS: i18n.t('Last 6 bi-months'),
    BIMONTHS_THIS_YEAR: i18n.t('Bi-months this year'),
    THIS_QUARTER: i18n.t('This quarter'),
    LAST_QUARTER: i18n.t('Last quarter'),
    LAST_4_QUARTERS: i18n.t('Last 4 quarters'),
    QUARTERS_THIS_YEAR: i18n.t('Quarters this year'),
    THIS_SIX_MONTH: i18n.t('This six-month'),
    LAST_SIX_MONTH: i18n.t('Last six-month'),
    LAST_2_SIXMONTHS: i18n.t('Last 2 six-month'),
    THIS_FINANCIAL_YEAR: i18n.t('This financial year'),
    LAST_FINANCIAL_YEAR: i18n.t('Last financial year'),
    LAST_5_FINANCIAL_YEARS: i18n.t('Last 5 financial years'),
}

export const getPeriodDetails = (id) => {
    let name = id
    if (id in relativePeriods) {
        name = relativePeriods[id]
        return { id, name }
    }

    try {
        name = createFixedPeriodFromPeriodId({
            periodId: id,
            calendar: 'gregory',
            locale: 'en',
        }).name
        return { id, name }
    } catch (e) {
        console.error(e)
        // if we cannot retrieve the name, we return what we have (name:id)
        return { id, name }
    }
}
