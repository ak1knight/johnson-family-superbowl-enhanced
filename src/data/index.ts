import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Constants for database configuration
const DYNAMODB_REGION = "us-west-1";
const SUPERBOWL_ENTRIES_TABLE = "SuperBowlEntries";
const WINNING_ENTRY_TABLE = "WinningEntry";
const BASE_YEAR = 2019; // Base year for calculating winning entry IDs

// Database client singleton with promise-based initialization to prevent race conditions
let dynamoClient: DynamoDBDocument | null = null;
let clientInitializationPromise: Promise<DynamoDBDocument> | null = null;
let lastInitializationError: Error | null = null;

// Async version that handles concurrent initialization safely
const getDynamoDBClientAsync = async (): Promise<DynamoDBDocument> => {
    // Return immediately if client is already initialized
    if (dynamoClient) {
        return dynamoClient;
    }

    // If there was a previous initialization error, clear it before retrying
    // This allows retry attempts after transient failures
    if (lastInitializationError) {
        lastInitializationError = null;
    }

    // If initialization is already in progress, wait for it to complete
    if (clientInitializationPromise) {
        return clientInitializationPromise;
    }

    // Start initialization
    clientInitializationPromise = (async () => {
        try {
            const options: DynamoDBClientConfig = {
                region: DYNAMODB_REGION,
            };

            const client = process.env.LOCAL_DYNAMO_DB_ENDPOINT
                ? new DynamoDBClient({
                    ...options,
                    endpoint: process.env.LOCAL_DYNAMO_DB_ENDPOINT
                })
                : new DynamoDBClient(options);

            dynamoClient = DynamoDBDocument.from(client);
            return dynamoClient;
        } catch (error) {
            // Cache the error for potential inspection
            lastInitializationError = error instanceof Error ? error : new Error('Unknown initialization error');
            throw lastInitializationError;
        } finally {
            // Clear the promise after initialization completes (success or failure)
            // This allows retry on next call if initialization failed
            clientInitializationPromise = null;
        }
    })();

    return await clientInitializationPromise;
};

// Helper function to calculate winning entry ID consistently
const calculateWinningEntryId = (year: number): string => {
    return String(year - BASE_YEAR);
};

// Helper function to validate year
const validateYear = (year: number): void => {
    if (!year || year < BASE_YEAR || year > new Date().getFullYear() + 1) {
        throw new Error(`Invalid year: ${year}. Must be between ${BASE_YEAR} and ${new Date().getFullYear() + 1}`);
    }
};

// Helper function to validate entry ID
const validateEntryId = (entryId: number): void => {
    if (!entryId || entryId <= 0) {
        throw new Error(`Invalid entry ID: ${entryId}`);
    }
};

const apiCalls = {
    readEntries: async (year: number) => {
        try {
            validateYear(year);
            
            const client = await getDynamoDBClientAsync();
            const { Items = [] } = await client
                .send(new ScanCommand({
                    TableName: SUPERBOWL_ENTRIES_TABLE,
                    FilterExpression: "yearKey = :y",
                    ExpressionAttributeValues: {
                        ":y": year
                    }
                }));

            return Items;
        } catch (error) {
            console.error(`Error reading entries for year ${year}:`, error);
            throw new Error(`Failed to read entries for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    getEntry: async (entryId: number) => {
        try {
            validateEntryId(entryId);
            
            const client = await getDynamoDBClientAsync();
            const result = await client
                .send(new GetCommand({
                    TableName: SUPERBOWL_ENTRIES_TABLE,
                    Key: {
                        id: entryId
                    }
                }));

            return result;
        } catch (error) {
            console.error(`Error getting entry ${entryId}:`, error);
            throw new Error(`Failed to get entry ${entryId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    updateEntry: async (entryId: number, entry: Record<string, unknown>) => {
        try {
            validateEntryId(entryId);
            
            if (!entry || Object.keys(entry).length === 0) {
                throw new Error('Entry data is required for update');
            }

            const client = await getDynamoDBClientAsync();
            await client.send(new UpdateCommand({
                TableName: SUPERBOWL_ENTRIES_TABLE,
                Key: {
                    id: entryId
                },
                UpdateExpression: "set entry = :e, updatedAt = :u",
                ExpressionAttributeValues: {
                    ":e": entry,
                    ":u": new Date().toISOString()
                }
            }));
        } catch (error) {
            console.error(`Error updating entry ${entryId}:`, error);
            throw new Error(`Failed to update entry ${entryId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    createEntry: async (entry: Record<string, unknown>, year: number = new Date().getFullYear()) => {
        try {
            validateYear(year);
            
            if (!entry || Object.keys(entry).length === 0) {
                throw new Error('Entry data is required');
            }

            const entryId = Date.now();
            const client = await getDynamoDBClientAsync();
            await client.send(new PutCommand({
                TableName: SUPERBOWL_ENTRIES_TABLE,
                Item: {
                    id: entryId,
                    yearKey: year,
                    entry,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            }));

            return entryId;
        } catch (error) {
            console.error("Error creating entry for year %s:", year, error);
            throw new Error(`Failed to create entry for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    createWinningEntry: async (entry: Record<string, unknown>, year: number) => {
        try {
            validateYear(year);
            
            if (!entry || Object.keys(entry).length === 0) {
                throw new Error('Winning entry data is required');
            }

            const client = await getDynamoDBClientAsync();
            await client.send(new UpdateCommand({
                TableName: WINNING_ENTRY_TABLE,
                Key: {
                    id: calculateWinningEntryId(year)
                },
                UpdateExpression: "set entry = :e, updatedAt = :u",
                ExpressionAttributeValues: {
                    ":e": entry,
                    ":u": new Date().toISOString()
                }
            }));
        } catch (error) {
            console.error(`Error creating winning entry for year ${year}:`, error);
            throw new Error(`Failed to create winning entry for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    getWinningEntry: async (year: number) => {
        try {
            validateYear(year);
            
            const client = await getDynamoDBClientAsync();
            const { Item } = await client
                .send(new GetCommand({
                    TableName: WINNING_ENTRY_TABLE,
                    Key: {
                        id: calculateWinningEntryId(year)
                    }
                }));

            return Item;
        } catch (error) {
            console.error(`Error getting winning entry for year ${year}:`, error);
            throw new Error(`Failed to get winning entry for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};
export default apiCalls;