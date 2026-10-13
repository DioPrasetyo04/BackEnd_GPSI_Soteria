import type { Request, Response, NextFunction } from "express";
import { OrganizationRepositories } from "../repositories/OrganizationRepository";
import { OrganizationServices } from "../services/OrganizationServices";
import responses from "../../../utils/response";
import type { OrganizationQueryInput } from "../validator/OrganizationSchema";

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
    const query = (res.locals.validatedQuery ||
      req.query) as unknown as OrganizationQueryInput;
    const result = await orgService.getAllOrganizations(query);
    responses(res, 200, "Berhasil mengambil data struktur organisasi", result);
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
