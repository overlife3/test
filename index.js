import express from "express"

const app = express()
const port = 5000

app.use('/', (req, res) => {
	res.json({message: "Hello from express"})
})

app.listen(9000, () => {
	console.log(`starting server on port: ${port}`)
})