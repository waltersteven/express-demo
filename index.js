const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'Big Data'},
    {id: 2, name: 'Business Intelligence'},
    {id: 3, name: 'iOS Developing'},
];
app.get('/', (req, res) => {
    res.send('Hello World, bro');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//route parameters: http://localhost:5000/api/courses/2014/08
// app.get('/api/courses/:year/:month', (req, res) => {
//     res.send(req.params);
// });

// query string parameters: http://localhost:5000/api/courses/2014/08?orderBy=name
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    //404 
    if(!course) return res.status(404).send('The course with the give ID was not found');

    res.send(course);
});

app.post('/api/courses', (req, res) => {
    //for validation
    const { error } = validateCourse(req.body); // error = result.error
    if(error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return; //doesnt execute the rest of the code
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name //name is a property
    };
    courses.push(course);
    res.send(course); // by convention we return the object in the body of the respond
});

app.put('/api/courses/:id', (req, res) => {
    //lookup for the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    //404 
    if(!course) return res.status(404).send('The course with the give ID was not found');
    //validate
    // const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // error = result.error
    if(error) {
        //400 bad request
        res.status(400).send(error.details[0].message);
        return; //doesnt execute the rest of the code
    }

    //update course
    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    //look up for the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the give ID was not found');
   
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(course);
    

});

//PORT
const port = process.env.PORT || 3000; //production approach, we define the PORT variable in the server (eg: Windows -> set PORT=5000)
app.listen(port, () => console.log(`Listening on port ${port}...`));

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}