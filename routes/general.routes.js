import { Router } from "express";

const router = Router();

// Views handler
router.get('/', (req, res) => {
  res.status(200).render('home');
})

router.get('', (req, res) => {
  res.redirect('/')
});

export default router;