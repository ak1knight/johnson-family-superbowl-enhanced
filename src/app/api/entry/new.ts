import data from "../../../data";

async function create(req, res) {
    console.log("/api/entry/new HIT!");
    const entry = JSON.parse(req.body).entry;
    await data.createEntry(entry);
    res.status(200).end("OK");
};

export default create;