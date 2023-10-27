const express = require('express')
const app = express()
const port = 3000

app.use(express.static("static"))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})