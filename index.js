
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())


const cors = require('cors')

app.use(cors())
let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]
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
   response.json(persons) 
})
app.get('/info' , (request, response)=>{
    response.send(`
    <p> Phonebook has ${persons.length} contacts</p>
    <p> ${ new Date}</p>
    `)
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
    const person = request.body
    if(!person.name || !person.number)
    {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    else if(persons.find(x=>x.name=== person.name))
    {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.floor(Math.random() * 9999)
    person.id = id
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
  })
app.post('/api/persons')
const PORT = process.env.PORT || 3001
app.listen(PORT)