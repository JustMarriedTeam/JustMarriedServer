module.exports = {
    get: function (req, res) {
        res.status(200).json({
            text: 'Hi there!'
        });
    }
};