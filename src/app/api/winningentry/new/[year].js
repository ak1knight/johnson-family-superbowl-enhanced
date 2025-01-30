import data from "../../../../data";

async function setWinningEntry(req, res) {
    console.log("/api/winningentry/new HIT!");
    const entry = JSON.parse(req.body).entry;
    await data.createWinningEntry(entry, parseInt(req.query.year));
    res.status(200).end("OK");
};

export default setWinningEntry;