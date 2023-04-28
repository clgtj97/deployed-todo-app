const PORT = process.env.PORT ?? 8000
// if secret variable dosn't exist to change port 
// on kinsa, use port 8000
const express = require('express')
// call express for use
const cors = require('cors')
const app = express()
// passed all efects from express to app
const pool = require('./db')
// request the pool const from db.js to conect to our db
const { v4: uuidv4 } = require('uuid')
// GET v4 uuid from documentation and require uuid package to create unique id's
const bcrypt = require('bcrypt')
// used to hash sensitive data
const jwt = require('jsonwebtoken')
// used to create server tokens

app.use(cors())
// helps us avoid BLOCK FROM HOST cors policy
app.use(express.json())
//so we can parse JSON code
// AND should delete the POST 500 internal server error

// get all todos
app.get('/todos/:userEmail', async (req, res) => {
         // /todos endpoint 
    const { userEmail } = req.params
     // parced the useEmail as a param from the front-end and catched it as a req.params for the back-end
    // deconstruct the param for the req
    try{
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1', [userEmail])
                    // use pool to const to conect to db and use query            * SELECT info from WHERE userEmail is equal to db
        res.json(todos.rows) 
        // responde as json of const todos and only show rows secction of data from db pull
    }catch(err){
        console.error(error)
    }
})

// CREATE a new todo
app.post('/todos', async (req, res) => {
    const { user_email, title, progress, date } = req.body
    // atach query data to the body and destructure it, exept the ID
    console.log(user_email, title, progress, date)
    const id = uuidv4()
    try{
        const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5) `,
        [id, user_email, title, progress, date])
        res.json(newToDo)
    }catch(err){
        console.error(err)
    }
})

// EDIT a todo
app.put('/todos/:id', async (req, res) =>{
   const { id } = req.params
   const { user_email, title, progress, date } =  req.body 
   // destructuring elemtns from req and res
   try{
    const editToDo = 
        await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;', 
        [user_email, title, progress, date, id])
    res.json(editToDo)
   }catch (err) { 
    console.error(err)
   }
})

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try{
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1', [id])
        res.json(deleteToDo)
    } catch (err) {
        console.error(err)
    }
})

// signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    //  so we can hash it in the sign up and compare 
    //  it to the hash password that we have saved
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    //hash data and compare it to password on file
    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
         [email, hashedPassword])
        
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

        res.json({ email, token })

    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail })
        } 
        // display error in front-end console as well
    }
})

//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        // sql comand to get email from db that will be compared
        if (!users.rows.length) return res.json({ detail : 'Userdoes not exist!' })
        // If user.rows.length does not exist return json detail error of non existin user
        
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        // compare password entered in front end to users hashed password ( hash entered password and compares hashed password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})
        // generate unique acces token 
        if (success) {
            res.json({ 'email' : users.rows[0].email, token })
            // IF successfull, pull firs row on users-email and generate token to access 
        } else {
            res.json({ detail : 'Login Failed'})
        }
    } catch(err) {
        console.error(err)
    }
})

app.listen(PORT, ()=> console.log(`Server running on on PORT ${PORT}` && `http://localhost:${PORT}`)) 
/*listen out for changes on the port stated
 use `${example}` to treat line as code not as TEXT */
