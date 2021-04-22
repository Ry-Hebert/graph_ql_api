const express = require('express')
const expressGraphQL = require('express-graphql')

const app = express()
app.listen(4876, () =>{console.log('The server is running')})

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}))