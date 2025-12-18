import {stringify} from 'csv-stringify/sync'

export async function csvExporter<T extends object>(data: T[], filename: string) {
    if(data.length === 0) throw new Error("Data array is empty.")

    const fileN = `${filename}-${Date.now()}`

    try {
        const csvContent = stringify(data, {
            header: true,
            cast: {
                date: (value) => value.toISOString()
            }
        })

       return csvContent
    } catch (error) {
        console.error("CSV export failed", error)
    }
}