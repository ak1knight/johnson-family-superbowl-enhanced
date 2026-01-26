import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDbRegion = "us-west-1";

const getDynamoDBClient = (): DynamoDBDocument => {

    const options:DynamoDBClientConfig = {
        region: dynamoDbRegion,
    };

    const client = process.env.LOCAL_DYNAMO_DB_ENDPOINT
        ? new DynamoDBClient({
            ...options,
            endpoint: process.env.LOCAL_DYNAMO_DB_ENDPOINT
        })
        : new DynamoDBClient(options);

    return DynamoDBDocument.from(client);
};

const apiCalls = {
    readEntries: async (year: number) => {
        console.log(year);
        const { Items } = await getDynamoDBClient()
            .send(new ScanCommand({
                TableName: "SuperBowlEntries",
                FilterExpression: "yearKey = :y",
                ExpressionAttributeValues: {
                    ":y": year
                }
            }));

        return Items;
    },
    getEntry: async (entryId: number) => {
        const entry = await getDynamoDBClient()
            .send(new GetCommand({
                TableName: "SuperBowlEntries",
                Key: {
                    id: entryId
                }
            }));

        return entry;
    },
    updateEntry: async (entryId: number, entry: Record<string, unknown>) => {
        const client = getDynamoDBClient();

        await client.send(new UpdateCommand({
            TableName: "SuperBowlEntries",
            Key: {
                id: entryId
            },
            UpdateExpression: "set entry = :e",
            ExpressionAttributeValues: {
                ":e": entry
            }
        }));
    },
    createEntry: async (entry: Record<string, unknown>) => {
        await getDynamoDBClient().send(new PutCommand({
            TableName: "SuperBowlEntries",
            Item: {
                id: Date.now(),
                yearKey: 2025,
                entry
            }
        }));
    },
    createWinningEntry: async (entry: Record<string, unknown>, year: number) => {
        const client = getDynamoDBClient();

        await client.send(new UpdateCommand({
            TableName: "WinningEntry",
            Key: {
                id: String(year - 2019)
            },
            UpdateExpression: "set entry = :e",
            ExpressionAttributeValues: {
                ":e": entry
            }
        }));
    },
    getWinningEntry: async (year: number) => {
        console.log(year);
        const { Item } = await getDynamoDBClient()
            .send(new GetCommand({
                TableName: "WinningEntry",
                Key: {
                    id: String(year - 2019)
                }
            }));

        return Item;
    }
};
export default apiCalls;