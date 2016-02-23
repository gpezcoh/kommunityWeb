var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  // Post = require('../models/post').schema;

var PostSchema = new Schema({
  name: String,
  categoryNames: [String],
  categoryValues: [String]
  // post: [{type: Number, ref: 'Group'}]
});

mongoose.model('Post', PostSchema);

var GroupSchema = new Schema({
  name: String,
  postStructures : [PostSchema],
  posts: [PostSchema],
  selected: String
});

mongoose.model('Group', GroupSchema);

var UserSchema = new Schema({
  name: String,
  // groups: [{type: Schema.Types.ObjectId, ref: 'Group'}]
   // groups: {type: Schema.Types.ObjectId, ref: 'Group'}
   groups: [GroupSchema]
});

mongoose.model('User', UserSchema);