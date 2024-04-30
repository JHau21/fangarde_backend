const bcrypt = require("bcrypt");
const User = require('../db/models/user_model.js')
const jwt = require("jsonwebtoken");


module.exports =  function(app){
    app.post("/register_user", (request, response) => {
        bcrypt.hash(request.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                email: request.body.email,
                password: hashedPassword,
                first_name: request.body.first_name,
                last_name: request.body.last_name,
                phone_number: request.body.phone_number,
            });
            user.save().then((result) => {
                //   create JWT token
                const token = jwt.sign(
                  {
                    userId: result._id,
                    userEmail: result.email,
                  },
                  process.env.JWT_USER_AUTH_SECRET,
                  { expiresIn: "24h" }
                );
                response.status(201).send({
                  message: "User Created Successfully",
                  result: {
                    user:result
                  },
                  user: result,
                  auth: token,
                  error: false,
                  type: "User"
                });
              })
              .catch((err) => {
                response.status(500).send({
                  message: "An error occurred, when creating your account. Please try again later.",
                  error: true,
                  err: JSON.stringify(err)
                });
              });
        })
      .catch((err) => {
        response.status(500).send({
          message: "An error occurred, when creating your account. Please try again later.",
          error: true,
          err: JSON.stringify(err)
        });
      });
    });
}
