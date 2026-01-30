import DatabaseService from "../../../../../data/database-service";

async function POST(req: Request, { params }: { params: Promise<{ year: string }> }) {
    try {
        console.log("/api/winningentry/new HIT!");
        const year = parseInt((await params).year);
        if (isNaN(year)) {
            return Response.json({ error: "Invalid year parameter" }, { status: 400 });
        }
        
        const { entry } = await req.json();
        if (!entry) {
            return Response.json(
                { error: "Winning entry data is required" },
                { status: 400 }
            );
        }

        await DatabaseService.setWinningEntry(entry, year);
        return Response.json({
            success: true,
            message: `Winning entry for ${year} saved successfully`
        });
    } catch (error) {
        console.error("/api/winningentry/new error:", error);
        return Response.json(
            {
                error: error instanceof Error ? error.message : "Failed to save winning entry",
                success: false
            },
            { status: 500 }
        );
    }
};

export {
    POST
};