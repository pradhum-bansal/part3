require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('post', (request,response)=>
{
    if(request.method === 'POST')
        return JSON.stringify(request.body)
    else
        return ''
})
morgan.format('postFormat',':method :url :status :res[content-length] - :response-time ms :post]')
app.use(morgan('postFormat'))



app.get('/api/persons' , (request,response)=>{
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info' , (request, response)=>{
    Person.find({}).then(persons => {
        response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
        `)
    })
})

app.get('/api/persons/:id' ,(request, response)=>
{
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id===id)
    if(person)
    response.json(person)
    else
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  const PORT =  process.env.PORT 
  app.listen(PORT,()=>  {
      console.log(`Server running on port ${PORT}`)
  })