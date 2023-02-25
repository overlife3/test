import express from "express"

const app = express()
const port = 5000

app.use('/', (req, res) => {
	res.json({message: "Hello from express"})
})

app.get('/api', (req, res) => {
	res.send('hello')
})

app.listen(9000, () => {
	console.log(`starting server on port: ${port}`)
})