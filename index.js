import express from "express"

const app = express()
const port = 5000

// app.use('/api', (req, res) => {
// 	res.json({message: "Hello from express"})
// })

app.get('/api', (req, res) => {
	res.send('hello')
})

app.listen(process.port || port, () => {
	console.log(`starting server on port: ${port}`)
})