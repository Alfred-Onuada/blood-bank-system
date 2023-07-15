import { Router } from "express";

const router = Router();

// Views handler
router.get('/', (req, res) => {
  res.render('home');
})

router.get('', (req, res) => {
  res.redirect('/')
});

router.get('/about', (req, res) => {
  res.render('about');
})

router.get('/contact', (req, res) => {
  res.render('contact');
})

export default router;