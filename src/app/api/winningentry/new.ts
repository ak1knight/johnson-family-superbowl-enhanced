import data from "../../../data";

async function createWinningEntry(req, res) {
    console.log("/api/winningentry/new HIT!");
    const entry = JSON.parse(req.body).entry;
    await data.createWinningEntry(entry, 2022);
    res.status(200).end("OK");
};

export default createWinningEntry;