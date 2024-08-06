"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class authResource {
    transform(user) {
        return {
            id: user.id,
            _id: user._id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
    collection(users) {
        return users.map(user => this.transform(user));
    }
}
exports.default = new authResource();
