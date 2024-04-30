# fangarde_node_backend
This is our repository for modifying our node application. We are keeping this separate from the web application repository to avoid confusion.


Use this template to create a new route in a new file

//Mongoose models

module.exports =  function(app){
    // Your code here
}

Then include it to the app.js file like this:

require('./register/register_user')(app);