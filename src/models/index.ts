import mongoose, { CallbackError, Model, model, Types, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

interface UserSchema extends Document {
  email: {
    type: String,
    unique: boolean,
    lowercase: boolean,
  };
  password: string;
}

// Define our model
const userSchema = new Schema<UserSchema>({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// before saving a model, run this function.
userSchema.pre<UserSchema>('save', function (this: UserSchema, next: (err?: CallbackError) => void) {
  const user = this; // user model

  // generate a salt and then callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
})

// create model class
const ModelClass = mongoose.model<UserSchema>('user', userSchema);

// export the model
export default ModelClass;