const controller = require('../controller');
const User = require('app/models/users');
const Role = require('app/models/role');


class userController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const users = await User.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate : { path : 'roles'} });
        res.render('admin/user/index', { users })
    }

    async create(req, res, next) {
        return res.render('admin/user/create');
    }

    async edit(req, res, next) {
        const user = await User.findById(req.params.id);
        res.render('admin/user/edit',  {  user });
    }

    async store(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد کاربر جدید درحال حاظر وجود ندارد')
            return this.back(req, res);
        }
    }

    storeProcess(req, res, next) {
        let { name, email, password } = req.body;
        const adduser = new User({
            name,
            email,
            password
        })

        adduser.save(err => { console.log(err) });
        return res.redirect('/admin/user');
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش کاربر درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        let { name, email, password } = req.body;
        await User.findByIdAndUpdate(req.params.id, { $set: { 
            name,
            email,
            password
         } });

        return res.redirect('/admin/user');
    }

    async destroy(req, res, next) {
        let user = await User.findById(req.params.id);
        if (! user) {
            res.json('چنین کاربری در سایت ثبت نام نکرده است')
        }

        user.remove();

        return res.redirect('/admin/user');
    }

    async userRoles(req, res, next) {
        const user = await User.findById(req.params.id);
        const roles = await Role.find({});

        res.render('admin/user/userRole' , { user, roles });
    }

    async addUserRoles(req, res, next) {
        const user = await User.findById(req.params.id);
        user.set({ roles : req.body.roles});
        user.save();
        return res.redirect('/admin/user');
    }

    async adminAccess(req, res, next) {
        const user = await User.findById(req.params.id);
        user.set({ admin : !user.admin});
        await user.save();
        return res.redirect('/admin/user');
    }

}



module.exports = new userController();