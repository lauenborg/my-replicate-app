export default async function handler(req, res) {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',

            // This is the text prompt that will be submitted by a form on the frontend
            input: { image: req.body.prompt },
        }),
    })

    if (response.status !== 201) {
        let error = await response.json()
        res.statusCode = 500
        res.end(JSON.stringify({ detail: error.detail }))
        return
    }

    const prediction = await response.json()
    res.statusCode = 201
    res.end(JSON.stringify(prediction))
}
