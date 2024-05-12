const express = require('express');

const mongoose = require('mongoose')
const authRouter = require('./routes/auth.routes')
const fileRouter = require('./routes/file.routes')
const config = require('config')
const cors = require('cors')



const app = express();
const PORT = config.get('serverPort') || 5000;

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/files', fileRouter)

const start = async () => {
  try{
    await mongoose.connect(config.get('mongoDb'))

    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.log(err)
  }
}



start()