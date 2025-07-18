const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { dbName: 'exercise-tracker', useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

const exerciseSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration:{
    type: Number,
    required: true
  },
  date:{
    type: Date
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

app.route('/api/users').post(async function(req, res) {
  try{
    const newUser = new User({ username: req.body.username });
    const savedUser = await newUser.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).send("Error saving user");
  }

})
.get(async function(req, res) {
  try{
    const allUsers = await User.find();
    res.json(allUsers)
  } catch (err){
    res.status(500).send("Error fetching users");
  }
  
});

app.route('/api/users/:_id/exercises').post(async function(req, res) {
  try{
    const user = await User.findById(req.params._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const { description, duration, date } = req.body;

    const newExercise = new Exercise({username: user.username, description: description, duration: parseInt(duration), date: date ? new Date(date) : new Date() });
    const savedExercise = await newExercise.save();

    res.json({ _id: user._id , username: user.username, description: savedExercise.description, duration: savedExercise.duration, date: savedExercise.date});
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving user");
  }

});

app.route('/api/users/:_id/logs').get(async function(req, res) {
  try{

    const user = await User.findById({_id: req.params._id});
    const { from, to, limit} = req.query;
    let dateFilter = {};
    
    //Filter Checks and Query construction
    if(from){
      dateFilter.$gte = new Date(from);
    }

    if(to){
      dateFilter.$lte = new Date(to);
    }

    let query = {username: user.username};

    if (from || to){
      query.date = dateFilter;
    }

    let allExercisesFromUser = Exercise.find(query);

    if(limit){
      allExercisesFromUser = allExercisesFromUser.limit(parseInt(limit));
    }
    
    //Query execution
    exercisesFromUser = await allExercisesFromUser.exec();

    //Fixing the output with a map for the JSON
    const log = exercisesFromUser.map(e => ({
    description: e.description,
    duration: e.duration,
    date: e.date.toDateString()
  }));

    res.json({_id: user.id, username: user.username, count: log.length, log: log});
  } catch (err){
    console.log(err);
    res.status(500).send("Error fetching users");
  }
  
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
