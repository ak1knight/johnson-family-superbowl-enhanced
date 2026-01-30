import apiCalls from './index';

/**
 * Database service abstraction layer
 * Provides a clean interface for database operations with consistent error handling
 */
export class DatabaseService {
    /**
     * Get all entries for a specific year
     */
    static async getEntriesByYear(year: number): Promise<any[]> {
        try {
            return await apiCalls.readEntries(year);
        } catch (error) {
            console.error(`DatabaseService: Failed to get entries for year ${year}:`, error);
            throw new Error(`Unable to retrieve entries for ${year}. Please try again later.`);
        }
    }

    /**
     * Get a single entry by ID
     */
    static async getEntryById(entryId: number): Promise<any> {
        try {
            const result = await apiCalls.getEntry(entryId);
            return result.Item || null;
        } catch (error) {
            console.error(`DatabaseService: Failed to get entry ${entryId}:`, error);
            throw new Error(`Unable to retrieve entry. Please try again later.`);
        }
    }

    /**
     * Create a new entry
     */
    static async createEntry(entry: Record<string, unknown>, year?: number): Promise<number> {
        try {
            return await apiCalls.createEntry(entry, year);
        } catch (error) {
            console.error('DatabaseService: Failed to create entry:', error);
            throw new Error('Unable to save your entry. Please check your data and try again.');
        }
    }

    /**
     * Update an existing entry
     */
    static async updateEntry(entryId: number, entry: Record<string, unknown>): Promise<void> {
        try {
            await apiCalls.updateEntry(entryId, entry);
        } catch (error) {
            console.error(`DatabaseService: Failed to update entry ${entryId}:`, error);
            throw new Error('Unable to update entry. Please try again later.');
        }
    }

    /**
     * Get winning entry for a specific year
     */
    static async getWinningEntryByYear(year: number): Promise<any> {
        try {
            return await apiCalls.getWinningEntry(year);
        } catch (error) {
            console.error(`DatabaseService: Failed to get winning entry for year ${year}:`, error);
            throw new Error(`Unable to retrieve winning entry for ${year}. Please try again later.`);
        }
    }

    /**
     * Create or update winning entry for a year
     */
    static async setWinningEntry(entry: Record<string, unknown>, year: number): Promise<void> {
        try {
            await apiCalls.createWinningEntry(entry, year);
        } catch (error) {
            console.error(`DatabaseService: Failed to set winning entry for year ${year}:`, error);
            throw new Error('Unable to save winning entry. Please try again later.');
        }
    }

    /**
     * Check if entry exists
     */
    static async entryExists(entryId: number): Promise<boolean> {
        try {
            const entry = await this.getEntryById(entryId);
            return entry !== null;
        } catch (error) {
            console.warn(`DatabaseService: Error checking if entry ${entryId} exists:`, error);
            return false;
        }
    }

    /**
     * Get entry count for a year
     */
    static async getEntryCountByYear(year: number): Promise<number> {
        try {
            const entries = await this.getEntriesByYear(year);
            return entries.length;
        } catch (error) {
            console.error(`DatabaseService: Failed to get entry count for year ${year}:`, error);
            return 0;
        }
    }

    /**
     * Batch operations - get entries for multiple years
     */
    static async getEntriesForYears(years: number[]): Promise<Record<number, any[]>> {
        const results: Record<number, any[]> = {};
        
        try {
            const promises = years.map(async (year) => {
                try {
                    const entries = await this.getEntriesByYear(year);
                    results[year] = entries;
                } catch (error) {
                    console.warn(`DatabaseService: Failed to get entries for year ${year}:`, error);
                    results[year] = [];
                }
            });

            await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('DatabaseService: Failed to get entries for multiple years:', error);
            throw new Error('Unable to retrieve entries for multiple years. Please try again later.');
        }
    }

    /**
     * Health check - verify database connectivity
     */
    static async healthCheck(): Promise<boolean> {
        try {
            // Try to get entries for current year as a health check
            const currentYear = new Date().getFullYear();
            await this.getEntriesByYear(currentYear);
            return true;
        } catch (error) {
            console.error('DatabaseService: Health check failed:', error);
            return false;
        }
    }
}

export default DatabaseService;