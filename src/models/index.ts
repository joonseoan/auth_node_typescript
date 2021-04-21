import mongoose, { CallbackError, Model, model, Types, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

export interface UserSchema extends Document {
  email: string;
  password: string;
  _id?: string;
  comparePassword: (password: string, callback: Function) => void;
}

// Define our model
export const userSchema = new Schema<UserSchema>({
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
});

// it is used as a middleware only when instance is created
userSchema.methods.comparePassword = function(
  candidatePassword: string,
  callback: Function,
) {
  
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
}

// create model class
const ModelClass = mongoose.model<UserSchema>('user', userSchema);

// export the model
export default ModelClass;