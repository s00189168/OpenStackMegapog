const Pog = require("../models/pogModel");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

async function getAggregatePogs(req, res, options = []) {
    const constraints = buildConstraintsList(req);
    const filter = constraints.length > 0 ? { $and: constraints } : {};

    // Get aggregate totals per keyword
    let totals = {};
    try {
        const totalsAggregatorOptions = [
            {
                $match: filter,
            },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
        ];
        const aggregateTotals = await Pog.aggregate(
            totalsAggregatorOptions
        ).exec();
        aggregateTotals.forEach((element) => {
            totals[element._id] = element.count;
        });
    } catch (exception) {
        console.log("Exception retrieving aggregate results: " + exception);
        res.status(500).json({ error: "Error retrieving aggregate results" });
    }

    // Get aggregate timeseries (to build graphs per type of keyword)
    let timeseries = {};
    try {
        const timeseriesAggregatorOptions = [
            {
                $match: filter,
            },
            {
                $project: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    type: "$type",
                },
            },
            {
                $group: {
                    _id: { date: "$date", type: "$type" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
        ];
        const dateResults = await Pog.aggregate(
            timeseriesAggregatorOptions
        ).exec();
        console.log(dateResults);
        dateResults.forEach((element) => {
            if (!(element._id.date in timeseries)) {
                timeseries[element._id.date] = {};
            }
            timeseries[element._id.date][element._id.type] = element.count;
        });
    } catch (exception) {
        console.log("Exception retrieving aggregate results: " + exception);
        res.status(500).json({ error: "Error retrieving aggregate results" });
    }

    res.status(200).json({ totals: totals, timeseries: timeseries });
}

async function getPogs(req, res, options = []) {
    const constraints = buildConstraintsList(req);
    const filter = constraints.length > 0 ? { $and: constraints } : {};

    const count = await Pog.find(filter).countDocuments();

    const sortOptions = buildSortOptions(req);

    await Pog.find(filter, null, sortOptions)
        .map((result) => {
            const resources = [];
            result.forEach((element) => {
                resources.push(element.toResource());
            });
            return resources;
        })
        .then((result) => {
            res.json({ count: count, items: result });
        })
        .catch((error) => res.status(500).json({ error: "Error: " + error }));
}

async function createPog(req, res) {
    let pogResource = new Pog(req.body);
    await pogResource
        .save()
        .then((result) => {
            res.location(result.uri)
                .status(201)
                .json({ id: result._id, uri: result.uri });
        })
        .catch((error) => {
            res.status(400).json({
                status: "Error",
                message: "Failed to create record: " + error,
            });
        });
}

function buildConstraintsList(req) {
    const channel = req.params.channel;
    const sinceMs = req.query.since;
    const untilMs = req.query.until;
    const constraints = [];
    if (channel) {
        constraints.push({ channel: channel });
    }
    if (sinceMs && untilMs) {
        constraints.push({
            createdAt: {
                $gte: new Date(parseInt(sinceMs)),
                $lt: new Date(parseInt(untilMs)),
            },
        });
    } else {
        let oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);
        constraints.push({
            createdAt: {
                $gte: oneMonthAgo,
                $lt: new Date(),
            },
        });
    }
    return constraints;
}

function buildSortOptions(req) {
    const limit = req.query.limit;
    const skip = req.query.skip;
    return {
        skip: skip ? parseInt(skip) : 0,
        limit: limit ? (parseInt(limit) <= 20 ? parseInt(limit) : 20) : 20,
        sort: {
            createdAt: -1,
        },
    };
}

module.exports = {
    createPog,
    getPogs,
    getAggregatePogs,
};
