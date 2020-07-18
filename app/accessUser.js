const ConnectRoles = require('connect-roles');
const Permission = require('app/models/permission');

const user = new ConnectRoles({

    failureHandler: function (req, res, action) {
        var accept = req.headers.accept || '';
        res.status(403);
        if (accept.indexOf('html')) {
            res.render('not access', { action });
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

const permissions = async () => {
    return await Permission.find({}).populate('roles').exec();
}

permissions()
    .then(permissions => {
        permissions.forEach(permission => {
            let roles = permission.roles.map(role => role._id);
            user.use(permission.name , (req)=>{
                return req.user.hasRoles(roles) ? true : false
            })
        })
    })

module.exports = user;