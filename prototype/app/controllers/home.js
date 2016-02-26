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
      userId: user.id,
      groups: user.groups
    });
  });
});

router.get('/new', function (req, res, next) {
  res.render('new');
});

router.get('/groups/new' , function (req,res,next){
  res.render('newGroup');
});

router.post('/posts/new/value' , function(req,res,next){
  console.log(req.body);
    User.findOne({_id: req.body.user}, function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.body.groupId){
             if(req.body.postName === "Announcement"){
                var cats = ["Summary", "Description", "Title"];
                var newPost = new Post({
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
                user.groups[i].posts.push(newPost)
              }
              else if(req.body.postName === "Event"){
                console.log("ayyy")
                var cats = ["Title", "Description", "Date", "Location"];
                var newPost = new Post({
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
                user.groups[i].posts.push(newPost)
              }
              else if(req.body.postName === "Job"){
                var cats = ["Company", "Role", "Location", "Description", "Date"];
                var newPost = new Post({
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
                user.groups[i].posts.push(newPost)
              }
              user.save(function (err,group) {
                  if (err) return console.error(err);
               });
          res.redirect('../../groups/' + user._id + "/" + req.body.groupId)
        }
      }     
  });
});

router.post('/posts/new' , function (req,res,next){
  User.findOne({_id: req.body.user}, function (err,user){
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.body.groupId){       
        if(req.body.postType === "Job"){
          var cats = ["Company", "Role", "Location", "Description", "Date"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                name: "Job",
                categoryNames: cats
            });        
         }
        else if(req.body.postType === "Event"){
          var cats = ["Title", "Description", "Date", "Location"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                name: "Event",
                categoryNames: cats
            });
        }
        else if(req.body.postType === "Announcement"){
          var cats = ["Title", "Description"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                name: "Announcement",
                categoryNames: cats
            });
        }
      }
    }
  });
});

router.post('/groups/new' , function(req,res,next){
    var posts = [];
    if(req.body.events){
      posts.push("Event");
    }
    if(req.body.jobs){
      posts.push("Job");
    }
    if(req.body.announcements){
      posts.push("Announcement");
    }
      var newGroup = new Group({
        name: req.body.name,
        postStructures: posts,
        posts: []
      });
      // console.log(newGroup.postStructures)
      newGroup.save(function (err,group) {
        if (err) return console.error(err);
        console.log(group)
    });
    User.findOne({name : "Gabe"}, function (err, user) {
      // user.groups = newGroup;
      user.groups.push(newGroup);
      user.save(function (err,group) {
        if (err) return console.error(err);
      });
      res.redirect('..');
  });
});

router.get('/posts/view', function(req,res){
  console.log("ayy")
  User.findOne({_id: req.query.user}, function (err,user){
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.query.groupId){
         console.log(user.groups[i])
         console.log(req.query.postType)
         var retPosts = [];
         for(var j = 0; j < user.groups[i].posts.length; ++j){
          if(user.groups[i].posts[j].name === req.query.postType){
            retPosts.push(user.groups[i].posts[j]);
          }
         }
        res.render('group', {
          user: user.id,
          title: user.groups[i].name,
          groupId: user.groups[i].id,
          posts: retPosts,
          postStructures: user.groups[i].postStructures
        });
        break;
      }
    }
  }); 
});

router.get('/groups/:userId/:id', function (req,res){
// router.get('/groups/:id', function (req,res){
    User.findOne({_id: req.params.userId},function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.params.id){
        res.render('group', {
          user: user.id,
          title: user.groups[i].name,
          groupId: user.groups[i].id,
          postStructures: user.groups[i].postStructures
        });
        break;
      }
    }
  });
});
