var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group'),
  Post = mongoose.model('Post'),
  nodemailer = require('nodemailer'),
  mailer = require('nodemailer-express-handlebars');

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
      userName: user.name,
      userId: user.id,
      user: user.id,
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
              }
              else if(req.body.postName === "Event"){
                console.log("ayyy")
                var cats = ["Title", "Description", "Date", "Location"];
                var newPost = new Post({
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
              }
              else if(req.body.postName === "Job"){
                var cats = ["Company", "Role", "Location", "Description", "Date"];
                var newPost = new Post({
                  name: req.body.postName,
                  categoryNames: cats,
                  categoryValues: req.body.textBody
                });
              }
              user.groups[i].posts.unshift(newPost)
              user.groups[i].newPosts.unshift(newPost)
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
                groups: user.groups,
                isGroup: true,
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
                groups: user.groups,
                isGroup: true,
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
                groups: user.groups,
                isGroup: true,
                name: "Announcement",
                categoryNames: cats
            });
        }
      }
    }
  });
});


router.get('/posts/new' , function (req,res,next){
  User.findOne({_id: req.query.user}, function (err,user){
    for(var i = 0; i < user.groups.length; ++i){
      if(user.groups[i].id === req.query.groupId){       
        if(req.query.postType === "Job"){
          var cats = ["Company", "Role", "Location", "Description", "Date"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Job",
                categoryNames: cats
            });        
         }
        else if(req.query.postType === "Event"){
          var cats = ["Title", "Description", "Date", "Location"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Event",
                categoryNames: cats
            });
        }
        else if(req.query.postType === "Announcement"){
          var cats = ["Title", "Description"];
           res.render('newPost', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                name: "Announcement",
                categoryNames: cats
            });
        }
      }
    }
  });
});

function sortPosts(group){
  var newPosts = []
  var newerPosts = []
  for(var i = 0; i < group.postStructures.length; ++i){
    newPosts.push({"name": group.postStructures[i], "posts": []})
  }
  for(var i = 0; i < group.newPosts.length; ++i){
    for(var j= 0; j < newPosts.length; ++j){
      if(group.newPosts[i].name === newPosts[j].name){
        newPosts[j].posts.unshift(group.newPosts[i])
        break;
      }
    }
  }
  for(var j= 0; j < newPosts.length; ++j){
      if(newPosts[j].posts.length !== 0){
        newerPosts.push(newPosts[j]);
      }
    }
  return newerPosts
}

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
    });
    User.findOne({name : "Gabe"}, function (err, user) {
      // user.groups = newGroup;
      user.groups.push(newGroup);
      user.save(function (err,group) {
        if (err) return console.error(err);
      });
    var newPosts = sortPosts(user.groups[user.groups.length-1])
     res.render('group', {
                user: user.id,
                groupName: user.groups[user.groups.length-1].name,
                groupId: user.groups[user.groups.length-1].id,
                groups: user.groups,
                newPosts: newPosts,
                isNew: true,
                isGroup: true,
                // postType: req.query.postType,
                postStructures: user.groups[user.groups.length-1].postStructures
              });  });
});

router.get('/posts/view', function(req,res){
  User.findOne({_id: req.query.user}, function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.query.groupId){
            if(req.query.postType === "New"){
              newPosts = sortPosts(user.groups[i])
             res.render('group', {
                        user: user.id,
                        groupName: user.groups[i].name,
                        groupId: user.groups[i].id,
                        groups: user.groups,
                        newPosts: newPosts,
                        isNew: true,
                        isGroup: true,
                        postType: req.query.postType,
                        postStructures: user.groups[i].postStructures
                      });
            }
            else{
               var retPosts = [];
               for(var j = 0; j < user.groups[i].posts.length; ++j){
                if(user.groups[i].posts[j].name === req.query.postType){
                  retPosts.push(user.groups[i].posts[j]);
                }
               }
              res.render('group', {
                user: user.id,
                groupName: user.groups[i].name,
                groupId: user.groups[i].id,
                groups: user.groups,
                isNew: false,
                isGroup: true,
                posts: retPosts,
                postType: req.query.postType,
                postStructures: user.groups[i].postStructures
              });
              break;
            }
        }
      }
    }); 
});

router.get('/groups/:userId/:id', function (req,res){
// router.get('/groups/:id', function (req,res){
    User.findOne({_id: req.params.userId},function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.params.id){
          if(user.groups[i].newPosts.length !== 0){
            var newPosts = checkNew(user.groups[i]);
          }
          var newPosts = sortPosts(user.groups[i])
          res.render('group', {
            user: user.id,
            newPosts: newPosts,
            isNew: true,
            userName: user.name,
            groupName: user.groups[i].name,
            groupId: user.groups[i].id,
            postStructures: user.groups[i].postStructures,
            groups: user.groups,
            isGroup: true
          });
        break;
      }
    }
  });
});

function checkNew(group){
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var firstDate = new Date();
  var secondDate = group.newPosts[group.newPosts.length - 1].date;
  // var secondDate = group.posts[0].date;
  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

  if(diffDays >= 7){
    group.newPosts.pop();
    group.save(function (err,group) {
        if (err) return console.error(err);
    });
    checkNew(group);
  }
}

router.get('/newsletter/:userId/:id', function (req,res){
// router.get('/groups/:id', function (req,res){
    User.findOne({_id: req.params.userId},function (err,user){
      for(var i = 0; i < user.groups.length; ++i){
        if(user.groups[i].id === req.params.id){
          res.render('newsLetter', {
            user: user.id,
            userName: user.name,
            groupName: user.groups[i].name,
            groupId: user.groups[i].id,
            postStructures: user.groups[i].postStructures,
            groups: user.groups,
            isGroup: true
          });
        break;
      }
    }
  });
});

router.get('/email/send', function (req,res){
  
  /*var smtpConfig = {
      host: 'smtp.gmail.com', // hostname 
      secure: true, // use SSL 
      port: 465, // port for secure SMTP 
      transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
      auth: {
        user: 'long.c.lee@gmail.com',
        pass: 'L@#c@#l15_05'
      }
  };

  var poolConfig = {
      pool: true,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: 'long.c.lee@gmail.com',
          pass: 'L@#c@#l15_05'
      }
  };

  var directConfig = {
      name: 'kommunity.com' // must be the same that can be reverse resolved by DNS for your IP
  };
  */
  
  var nodemailer = require('nodemailer');

  // Create a SMTP transporter object
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'long.c.lee@gmail.com',
          pass: 'L@#c@#l15_05'
      },
      logger: true, // log to console
      debug: true // include SMTP traffic in the logs
  }, {
      // default message fields

      // sender info
      from: 'kommunity <long.c.lee@gmail.com>',
      headers: {
          'X-Laziness-level': 1000 // just an example header, no need to use this
      }
  });

  console.log('SMTP Configured');

  // Message object
  var message = {

      // Comma separated list of recipients
      to: '"Long" <chenglongli2015@u.northwestern.edu>',

      // Subject of the message
      subject: 'Nodemailer is unicode friendly ✔', //

      // plaintext body
      text: 'Hello to myself!',

      // HTML body
      html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
          '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

      // Apple Watch specific HTML body
      watchHtml: '<b>Hello</b> to myself',

      // An array of attachments
      attachments: [

          // String attachment
          {
              filename: 'notes.txt',
              content: 'Some notes about this e-mail',
              contentType: 'text/plain' // optional, would be detected from the filename
          },

          // Binary Buffer attachment
          {
              filename: 'image.png',
              content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                  '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                  'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),

              cid: 'note@example.com' // should be as unique as possible
          },

          /*
          // File Stream attachment
          {
              filename: 'nyan cat ✔.gif',
              path: __dirname + '/assets/nyan.gif',
              cid: 'long.c.lee@gmail.com' // should be as unique as possible
          }
          */
      ]
  };

  console.log('Sending Mail');
  transporter.sendMail(message, function (error, info) {
      if (error) {
          console.log('Error occurred');
          console.log(error.message);
          res.redirect('..');
      }
      console.log('Message sent successfully!');
      console.log('Server responded with "%s"', info.response);
      res.redirect('..');
  });
});