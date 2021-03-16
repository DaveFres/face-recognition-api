const handeSignin = (req, res, db, bcrypt) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(() => res.status(400).json('unable to get user'));
            }

            return res.status(400).json('wrong credentials');
        })
        .catch(() => res.status(400).json('wrong credentials'));
}

module.exports = {
    handeSignin: handeSignin
};
