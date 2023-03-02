const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
   const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        }, 
      ],
    });

   const commentData =  await Blog.findByPk(req.params.id,{
      include: [   
        {
          model: Comment,
          attributes: ['name']['description'] ,
        },
      ],
    });
console.log(commentData);
  //  const comments=  await commentData.map((comment) => comment.get({ plain: true }));
  const blog = blogData.get({ plain: true });
  const comments = commentData.get({plain:true})

    res.render('blog', {
      ...blog,
      ...comments,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    console.error(err)
    res.status(500).json(err);
  }
});

router.post('/blog/:id/', withAuth, async (req, res) => {
  console.log('=======================================',
  req.params.id, req.body,
  "============================================");

  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      blog_id: req.blog_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});
// //app.post('/posts/:postId/comments', (req, res) => {
//   // INSTANTIATE INSTANCE OF MODEL
//   const comment = new Comment(req.body);

//   // SAVE INSTANCE OF Comment MODEL TO DB
//   comment
//     .save()
//     .then(() => Blog.findById(req.params.blogid))
//     .then((blog) => {
//       blog.comments.unshift(comment);
//       return blog.save();
//     })
//     .then(() => res.redirect('/'))
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});


router.get('/comments', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const blogData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        /*{
          model: Blog,
          attributes: ['name'],
        },*/
      ],
    });
    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
