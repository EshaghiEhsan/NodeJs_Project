const controller = require('../controller');
const Permission = require('app/models/permission');

class permissionController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const permissions = await Permission.paginate({}, { page, limit: 10, sort: { createAt: 1 }});
        res.render('admin/permission/index', { permissions })

    }

    async create(req, res, next) {
        res.render('admin/permission/create');
    }

    async edit(req, res, next) {
        const permission = await Permission.findById(req.params.id);
        res.render('admin/permission/edit',  {  permission });
    }

    async store(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    storeProcess(req, res, next) {
        let { name, label } = req.body;
        const addpermission = new Permission({
            name,
            label
        })

        addpermission.save(err => { console.log(err) });
        res.redirect('/admin/permission');
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        let { name , label} = req.body;
        await Permission.findByIdAndUpdate(req.params.id, { $set: {
                name,
                label
            } });

        return res.redirect('/admin/permission');
    }

    async destroy(req, res, next) {
        let permission = await Permission.findById(req.params.id);
        if (!permission) {
            res.json('چنین دسترسی در سایت ثبت نشده است')
        }

        permission.remove();

        return res.redirect('/admin/permission');
    }

}



module.exports = new permissionController();