import { GlobalModel } from "../model/global.model";

export function startOfDay(date: Date) {
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
export function periodFilter({period} : GlobalModel.period) {
    console.log(period)
    const now = new Date()
    let endDate, startDate;

    if(!period){
        console.log('use daily')
        startDate = startOfDay(new Date(now));
        endDate = new Date(now);
        return {startDate, endDate}
    } 

    switch (period) {
        case GlobalModel.filterType.daily:
            startDate = startOfDay(new Date(now))
            endDate = new Date(now)
            break;
        case GlobalModel.filterType.weekly:
            const dayOfweek = now.getDay()
            startDate = startOfDay(new Date(now))
            startDate.setDate(now.getDate() - dayOfweek);
            endDate = new Date(now)
            break;
        case GlobalModel.filterType.monthly:
            startDate = startOfDay(new Date(now));
            startDate.setDate(1);
            endDate = new Date(now);
            break;
        default:
            startDate = startOfDay(new Date(now));
            endDate = new Date(now);
    }

    return {startDate, endDate}
}
