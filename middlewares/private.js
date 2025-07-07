const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware to verify the JSON Web Token (JWT) validity
 * 
 * If token is valid, refreshes the token and sets user information in a cookie.
 * If token is invalid or missing, responds with a 401 status or redirects to the homepage.
 * 
 * @function checkJWT
 * @param {Object} req - The HTTP request containing the token cookie
 * @param {Object} res - The HTTP response - Used to redirect or send an error message
 * @param {Function} next - Used to execute the next middleware
 * 
 * @throws {401} If token is invalid or missing
 */
exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                let message = {'message' : "Le token n'est pas valide, veuillez vous reconnecter."};
                return res.status(401).json(message);
            } else {
                req.decoded = decoded;

                const expiresIn = 60 * 60 * 24;
                const newToken = jwt.sign({
                    user : decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn 
                });

                res.cookie('token', newToken, {
                    sameSite: 'Lax',
                    httpOnly: true,
                    secure: process.env.SECURE_COOKIE,
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.cookie('firstName', decoded.user.firstName, {
                    sameSite: 'Lax',
                    httpOnly: false,
                    secure: process.env.SECURE_COOKIE,
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.cookie('lastName', decoded.user.lastName, {
                    sameSite: 'Lax',
                    httpOnly: false,
                    secure: process.env.SECURE_COOKIE,
                    maxAge: 1000 * 60 * 60 * 24
                });
                next();
            }
        });
    } else {
        if (req.path === '/tableau-de-bord' || req.path.includes('catway') || req.path.includes('reservation')) {
            return res.redirect('/');
        }
        message = { 'message': 'Token manquant. Veuillez vous reconnecter'};
        return res.status(401).json(message);
    }
};