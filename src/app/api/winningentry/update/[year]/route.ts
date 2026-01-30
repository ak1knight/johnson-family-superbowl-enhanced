import DatabaseService from "../../../../../data/database-service";

async function PATCH(req: Request, { params }: { params: Promise<{ year: string }> }) {
    try {
        console.log("/api/winningentry/update HIT!");
        const year = parseInt((await params).year);
        if (isNaN(year)) {
            return Response.json({ error: "Invalid year parameter" }, { status: 400 });
        }
        
        const { partialEntry, section } = await req.json();
        if (!partialEntry) {
            return Response.json(
                { error: "Partial entry data is required" },
                { status: 400 }
            );
        }

        // Get existing winning entry
        let existingEntry;
        try {
            existingEntry = await DatabaseService.getWinningEntryByYear(year);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            // If no existing entry, start with empty object
            existingEntry = {};
        }

        // Merge partial update with existing data
        let updatedEntry;
        if (section) {
            // Update specific section
            updatedEntry = {
                ...existingEntry,
                [section]: {
                    ...existingEntry[section],
                    ...partialEntry[section]
                }
            };
        } else {
            // Merge at top level, preserving existing data
            updatedEntry = {
                ...existingEntry,
                ...partialEntry
            };
        }

        await DatabaseService.setWinningEntry(updatedEntry, year);
        
        return Response.json({
            success: true,
            message: `Winning entry ${section ? `section '${section}'` : ''} for ${year} updated successfully`,
            updatedEntry
        });
    } catch (error) {
        console.error("/api/winningentry/update error:", error);
        return Response.json(
            {
                error: error instanceof Error ? error.message : "Failed to update winning entry",
                success: false
            },
            { status: 500 }
        );
    }
};

export {
    PATCH
};