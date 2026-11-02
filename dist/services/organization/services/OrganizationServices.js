"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationServices = void 0;
const exceptions_1 = require("../../../exceptions");
class OrganizationServices {
    organizationRepository;
    constructor(organizationRepository) {
        this.organizationRepository = organizationRepository;
    }
    async getAllOrganizations(category) {
        return this.organizationRepository.getAllOrganizations(category);
    }
    async getOrganizationById(id) {
        const org = await this.organizationRepository.getOrganization(id);
        if (!org) {
            throw new exceptions_1.NotFoundError(`Data organisasi dengan id "${id}" tidak ditemukan`);
        }
        return org;
    }
    async createOrganization(data) {
        return this.organizationRepository.createOrganization(data);
    }
    async updateOrganization(id, data) {
        await this.getOrganizationById(id);
        return this.organizationRepository.updateOrganization(id, data);
    }
    async deleteOrganization(id) {
        await this.getOrganizationById(id);
        return this.organizationRepository.deleteOrganization(id);
    }
}
exports.OrganizationServices = OrganizationServices;
//# sourceMappingURL=OrganizationServices.js.map