import type { Request, Response, NextFunction } from "express";
import { OrganizationRepositories } from "../repositories/OrganizationRepository";
import { OrganizationServices } from "../services/OrganizationServices";
import type { OrganizationCategoryType } from "../data_interfaces/OrganizationInterface";
import responses from "../../../utils/response";

const orgRepo = new OrganizationRepositories();
const orgService = new OrganizationServices(orgRepo);

export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const organization = await orgService.createOrganization(req.body);
    responses(res, 201, "Data organisasi berhasil ditambahkan", {
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { category } = req.query;
    const organization = await orgService.getAllOrganizations(
      category as OrganizationCategoryType | undefined,
    );
    responses(res, 200, "Berhasil mengambil data struktur organisasi", {
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const organization = await orgService.getOrganizationById(String(id));
    responses(res, 200, "Data organisasi ditemukan", { organization });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const organization = await orgService.updateOrganization(
      String(id),
      req.body,
    );
    responses(res, 200, "Data organisasi berhasil diperbarui", {
      organization,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    await orgService.deleteOrganization(String(id));
    responses(res, 200, "Data organisasi berhasil dihapus", null);
  } catch (error) {
    next(error);
  }
};
