const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (req, h) => {
            return 'Hello'
        }
    }
]

module.exports = routes