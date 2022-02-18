const express = require('express'),

app = express()

require('dotenv').config()
app.set('view engine', 'ejs')
app.use('/api/', require('./routes/hello'))

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
  console.log(`Listening on Port: ${PORT}`)
})