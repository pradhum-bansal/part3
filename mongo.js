const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://pradhum:${password}@cluster0.8o7jd.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }

})
const Person = mongoose.model('Person', personSchema)

if(process.argv[3]&&process.argv[4])
{
    const person = new Person(
        {
            name : process.argv[3],
            number : process.argv[4]
        })
    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(item => console.log(item.name, item.number))
        mongoose.connection.close()
    })
}
