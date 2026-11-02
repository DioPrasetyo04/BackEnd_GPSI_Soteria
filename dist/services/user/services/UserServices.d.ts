import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import type { UserPublicInterface, UserQueryOptions, PaginatedUserResult } from "../data_interfaces/UserInterface";
export declare class UserServices {
    private readonly userRepository;
    constructor(userRepository: UserInterfaceRepositories);
    /**
     * Buat user baru.
     * - Validasi format email (custom helper)
     * - Cek keunikan email
     * - Hash password sebelum disimpan
     */
    createUser(data: Prisma.UserCreateInput): Promise<UserPublicInterface>;
    /**
     * Ambil satu user berdasarkan ID.
     * Lempar NotFoundError jika tidak ditemukan.
     */
    getUserById(id: string): Promise<UserPublicInterface>;
    /**
     * Ambil semua user dengan opsi pagination, search keyword (q), dan sorting.
     * Mengembalikan items, pagination metadata, serta alias 'users' untuk kompatibilitas.
     */
    getAllUsers(options?: UserQueryOptions): Promise<PaginatedUserResult>;
    /**
     * Update data user.
     * - Cek user ada dulu
     * - Validasi email baru jika diisi
     * - Hash ulang password jika diisi
     * - Sinkronisasi dua arah antara primary role dan multiple roles
     */
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserPublicInterface>;
    /**
     * Hapus user berdasarkan ID.
     * Lempar NotFoundError jika tidak ada.
     */
    deleteUser(id: string): Promise<boolean>;
}
//# sourceMappingURL=UserServices.d.ts.map