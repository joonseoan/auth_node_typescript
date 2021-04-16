import mongoose, { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const { Schema } = mongoose;

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// userSchema.pre('save', function (next: CallbackError | undefined) {
//   const user = this;

//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) {
//       return next(err);
//     }

//     bcrypt.hash(user.password, salt, null, (err, hash) => {
//       if (err) {
//         return next(err);
//       }

//       user.password = hash;
//       next();
//     });
//   });
// })

// create model class
const ModelClass = mongoose.model('user', userSchema);

// export the model
export default ModelClass;