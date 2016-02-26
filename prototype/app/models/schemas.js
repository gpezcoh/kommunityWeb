var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  // Post = require('../models/post').schema;

var PostSchema = new Schema({
  name: String,
  categoryNames: [String],
  categoryValues: [String],
});

mongoose.model('Post', PostSchema);


var GroupSchema = new Schema({
  name: String,
  postStructures : [String],
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