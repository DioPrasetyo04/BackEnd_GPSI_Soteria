"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.getOrganizationById = exports.getAllOrganizations = exports.createOrganization = void 0;
const OrganizationRepository_1 = require("../repositories/OrganizationRepository");
const OrganizationServices_1 = require("../services/OrganizationServices");
const response_1 = __importDefault(require("../../../utils/response"));
const orgRepo = new OrganizationRepository_1.OrganizationRepositories();
const orgService = new OrganizationServices_1.OrganizationServices(orgRepo);
const createOrganization = async (req, res, next) => {
    try {
        const organization = await orgService.createOrganization(req.body);
        (0, response_1.default)(res, 201, "Data organisasi berhasil ditambahkan", {
            organization,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrganization = createOrganization;
const getAllOrganizations = async (req, res, next) => {
    try {
        const { category } = req.query;
        const organization = await orgService.getAllOrganizations(category);
        (0, response_1.default)(res, 200, "Berhasil mengambil data struktur organisasi", {
            organization,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrganizations = getAllOrganizations;
const getOrganizationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organization = await orgService.getOrganizationById(String(id));
        (0, response_1.default)(res, 200, "Data organisasi ditemukan", { organization });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrganizationById = getOrganizationById;
const updateOrganization = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organization = await orgService.updateOrganization(String(id), req.body);
        (0, response_1.default)(res, 200, "Data organisasi berhasil diperbarui", {
            organization,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrganization = updateOrganization;
const deleteOrganization = async (req, res, next) => {
    try {
        const { id } = req.params;
        await orgService.deleteOrganization(String(id));
        (0, response_1.default)(res, 200, "Data organisasi berhasil dihapus", null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrganization = deleteOrganization;
//# sourceMappingURL=OrganizationController.js.map