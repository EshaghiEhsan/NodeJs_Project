const controller = require('../controller');
const Category = require('app/models/category');
class categoryController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const categories = await Category.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate : { path : 'parent'} });
        res.render('admin/category/index', { categories })

    }

    async create(req, res, next) {
        const categories = await Category.find({parent : null});
        res.render('admin/category/create', { categories });
    }

    async edit(req, res, next) {
        const category = await Category.findById(req.params.id);
        const categories = await Category.find({parent : null});
        res.render('admin/category/edit',  {  category, categories });
    }

    async store(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد دسته بندی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    storeProcess(req, res, next) {
        let { name, parent } = req.body;
        const addcategory = new Category({
            name,
            slug: this.slug(name),
            parent : parent == 'none' ? null : parent
        })

        addcategory.save(err => { console.log(err) });
        res.redirect('/admin/category');
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g, '-')
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش دسته بندی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        let { name , parent} = req.body;
        await Category.findByIdAndUpdate(req.params.id, { $set: { 
            name,
            parent : parent == 'none' ? null : parent,
            slug : this.slug(name)
         } });

        return res.redirect('/admin/category');
    }

    async destroy(req, res, next) {
        let category = await Category.findById(req.params.id).populate('childs').exec();
        if (!category) {
            res.json('چنین دسته بندی در سایت ثبت نشده است')
        }

        // delete episode
        category.childs.forEach(category => category.remove());

        category.remove();

        return res.redirect('/admin/category');
    }

}



module.exports = new categoryController();