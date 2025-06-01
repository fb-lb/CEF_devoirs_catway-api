const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

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
        message = { 'message': 'Token manquant. Veuillez vous reconnecter'};
        return res.status(401).json(message);
    }
};