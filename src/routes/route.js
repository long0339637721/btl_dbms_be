const AdminRoute = require('./adminRoute')
const OrderRoute = require('./orderRoute')
const ProductRoute = require('./productRoute')
const ReviewRoute = require('./reviewRoute')
const UserRoute = require('./userRoute')

const route = (app) => {
    app.use('/admin', AdminRoute)
    app.use('/order', OrderRoute)
    app.use('/product', ProductRoute)
    app.use('/review', ReviewRoute)
    app.use('/user', UserRoute)
}

module.exports = route