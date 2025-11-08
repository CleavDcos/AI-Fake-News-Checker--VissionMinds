const express = require('express');
const router = express.Router();
const {
    submitArticle,
    getArticles,
    getArticle,
    getMyArticles,
    updateArticle,
    deleteArticle,
    extractDomain
} = require('../controllers/article.controller');
const { protect } = require('../middleware/authMiddleware');
const { validateArticle } = require('../validations/article.validation');

router.use(protect); // All routes require authentication

router.post('/', validateArticle, submitArticle);
router.get('/', getArticles);
router.get('/my-articles', getMyArticles);    // <-- static, goes before
router.post('/extract-domain', extractDomain);

// Dynamic routes last!
router.get('/:id', getArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);



module.exports = router;

