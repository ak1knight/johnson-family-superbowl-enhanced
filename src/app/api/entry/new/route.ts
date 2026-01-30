import DatabaseService from "../../../../data/database-service";

async function POST(req: Request) {
    try {
        console.log("/api/entry/new HIT!");
        const { entry, year } = await req.json();
        
        if (!entry) {
            return Response.json(
                { error: "Entry data is required" },
                { status: 400 }
            );
        }

        const entryId = await DatabaseService.createEntry(entry, year);
        return Response.json({
            success: true,
            entryId,
            message: "Entry created successfully"
        });
    } catch (error) {
        console.error("/api/entry/new error:", error);
        return Response.json(
            {
                error: error instanceof Error ? error.message : "Failed to create entry",
                success: false
            },
            { status: 500 }
        );
    }
};

export {
    POST
};