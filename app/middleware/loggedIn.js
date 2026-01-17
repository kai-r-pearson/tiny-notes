export default function loggedIn(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/notes");
    }
    next();
};