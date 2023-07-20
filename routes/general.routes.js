import { Router } from "express";
import authRoutes from "./auth.routes.js";
import jwt from "jsonwebtoken";
import userRoutes from "./user.routes.js"
import adminRoutes from "./admin.routes.js"

const router = Router();

const getNavInfo = function (req) {
  const token = req.cookies?.tk;

  let navInfo = {};

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      navInfo['email'] = decoded.email;
      navInfo['userType'] = decoded.userType;
    } catch (error) {
      // I don't want to do anything on error
    }
  }

  return navInfo;
}

// Views handler
router.get('/', (req, res) => {
  const navInfo = getNavInfo(req);

  res.render('home', navInfo);
})

router.get('', (req, res) => {
  res.redirect('/')
});

router.get('/logout', (req, res) => {
  res.clearCookie('tk');
  
  res.redirect('/');
});

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/admin', adminRoutes)

export default router;