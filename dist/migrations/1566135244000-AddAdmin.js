"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Administrator_1 = require("../models/Administrator");
const bcrypt = require("bcrypt");
class AddAdmin1566135244000 {
    async up(queryRunner) {
        let admin = await Administrator_1.Administrator.findOne({ where: { username: 'admin' } });
        if (admin == null) {
            admin = new Administrator_1.Administrator();
            admin.first_name = "Admin";
            admin.last_name = 'Admin';
            admin.username = 'admin';
            admin.password = bcrypt.hashSync("admin#12345", 10);
            await admin.save();
        }
    }
    async down(queryRunner) {
        let admin = await Administrator_1.Administrator.findOneOrFail({ where: { username: 'admin' } });
        await admin.remove();
    }
}
exports.AddAdmin1566135244000 = AddAdmin1566135244000;
//# sourceMappingURL=1566135244000-AddAdmin.js.map