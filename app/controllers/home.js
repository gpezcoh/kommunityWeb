var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group'),
  Post = mongoose.model('Post');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  User.findOne({name : "Gabe"}, function (err, user) {
    if (!user){
      console.log("no user")
        var newUser = new User({
          name: "Gabe",
        });

        newUser.save(function (err) {
          if (err) return console.error(err);
        });
        user = newUser;
    }
    res.render('index', {
      title: user.name,
      groups: user.groups
    });
  });
});

router.get('/new', function (req, res, next) {
  res.render('new');
});

router.get('/groups/new' , function(req,res,next){
  res.render('newGroup');
});

router.post('/posts/new/value' , function(req,res,next){
  Group.findOne({name: req.body.group}, function(err, group){
    var newPost = new Post({
      name: req.body.postName,
      categoryNames: req.body.postCat,
      categoryValues: req.body.textBody
    })
    group.posts.push(newPost)
    group.save(function (err,group) {
        if (err) return console.error(err);
     });
    res.redirect('../../groups/' + group._id)
  })
});

router.post('/posts/new' , function(req,res,next){
  console.log("ayy")
  Group.findOne({name: req.body.group}, function(err, group){
    console.log(group)
    for(var i = 0; i < group.postStructures.length; ++i){
      if(group.postStructures[i]["name"] === req.body.postType){
        // console.log(group.postStructures[i])
        res.render('newPost', {
            group: req.body.group,
            post: group.postStructures[i]
        });
        break;
      }
    }
  })
});

router.post('/groups/new' , function(req,res,next){
    var posts = [];
    // console.log(req.body["postCategory12"])
    // console.log(req.body["postName" + 1])
    // var test = "postName1";
    // console.log(req.body.test)
    // console.log(req.body)
    for(var i = 1; i < 4; ++i){
      var newPost = new Post({
          name: req.body["postName" + i],
          categoryNames: [req.body["postCategory" + i + "1"], req.body["postCategory" + i + "2"],
           req.body["postCategory" + i + "3"]]
        });
      posts.push(newPost);
      // newPost.save(function (err,group) {
      //   if (err) return console.error(err);
      // });
    }
    // console.log(posts)
      var newGroup = new Group({
        name: req.body.name,
        postStructures: posts,
        posts: []
      });
      console.log(newGroup.postStructures)
      newGroup.save(function (err,group) {
        if (err) return console.error(err);
    });
     // User.findOne({name : "Gabe"}).populate('groups').exec(function (err, user) {
     //    if (err) return console.error(err);
     //  });
    User.findOne({name : "Gabe"}, function (err, user) {
      // user.groups = newGroup;
      user.groups.push(newGroup);
      user.save(function (err,group) {
        if (err) return console.error(err);
      });
      // Group.populate(user, {path: "groups", model: "Group"}, function(err,user){
      //   if(err) return console.error(err);
      // })
      // console.log(user.groups[user.groups.length - 1]);
      // res.render('index', {
      //   title: user.name,
      //   groups: user.groups
      // });
      res.redirect('..');
  });
});

router.get('/posts/view', function(req,res){
  Group.findOne({name: req.query.group}, function(err, group){
    var retPosts = [];
    for(var i = 0; i < group.posts.length; ++i){
      if(group.posts[i].name === req.query.postType){
        retPosts.push(group.posts[i]);
      }
    }
    res.render('group', {
      title: group.name,
      posts: retPosts,
      postStructures: group.postStructures
    });
  })    
});

router.get('/groups/:id', function (req,res){
  Group.findOne({_id: req.params.id}, function (err,group){
    if(err) return;
    res.render('group', {
      title: group.name,
      postStructures: group.postStructures
    });
  });
});


router.post('/new', function (req, res, next) {
  var newUser = new User({
    name: req.body.name,
  });

  newUser.save(function (err) {
    if (err) return console.error(err);
  });
  res.render('index')
});
