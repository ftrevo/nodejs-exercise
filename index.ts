import 'dotenv/config'
import process from 'node:process'
import { app } from './src/app'

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  console.log(`Application running on port ${port}!`)
})
