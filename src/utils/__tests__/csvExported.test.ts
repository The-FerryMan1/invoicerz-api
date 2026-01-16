import { describe, it, expect, beforeEach, vi } from 'bun:test'
import { csvExporter } from '../../utils/csvExported'

// Mock csv-stringify
vi.mock('csv-stringify/sync', () => ({
  stringify: vi.fn((data, options) => {
    // Simple mock implementation
    if (data.length === 0) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row =>
      Object.values(row).map(val =>
        typeof val === 'object' && val instanceof Date
          ? val.toISOString()
          : String(val)
      ).join(',')
    ).join('\n')

    return `${headers}\n${rows}`
  })
}))

describe('csvExporter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export data to CSV format', async () => {
    const testData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]

    const result = await csvExporter(testData, 'users')

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).toContain('id,name,email')
    expect(result).toContain('1,John Doe,john@example.com')
    expect(result).toContain('2,Jane Smith,jane@example.com')
  })

  it('should handle date objects correctly', async () => {
    const testDate = new Date('2024-01-15T10:00:00Z')
    const testData = [
      { id: 1, createdAt: testDate }
    ]

    const result = await csvExporter(testData, 'records')

    expect(result).toContain(testDate.toISOString())
  })

  it('should throw error for empty data array', async () => {
    const testData: any[] = []

    expect(async () => {
      await csvExporter(testData, 'empty')
    }).toThrow('Data array is empty.')
  })

  it('should handle single row data', async () => {
    const testData = [
      { id: 1, name: 'Single User' }
    ]

    const result = await csvExporter(testData, 'single')

    expect(result).toContain('id,name')
    expect(result).toContain('1,Single User')
  })

  it('should handle different data types', async () => {
    const testData = [
      { id: 1, active: true, score: 95.5, tags: ['admin', 'user'] }
    ]

    const result = await csvExporter(testData, 'mixed')

    expect(result).toContain('id,active,score,tags')
    expect(result).toContain('1,true,95.5,admin,user')
  })
})