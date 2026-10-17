import type { Role } from "./Request";

export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  module: string;
}

export const PERMISSION_MODULES = [
  {
    module: "dashboard",
    title: "Ringkasan & Dashboard",
    permissions: [
      {
        id: "dashboard.view",
        name: "Lihat Dashboard",
        description: "Akses ke ringkasan metrik statistik dan grafik gereja",
        module: "dashboard",
      },
    ],
  },
  {
    module: "jadwal",
    title: "Jadwal Ibadah & Acara",
    permissions: [
      {
        id: "jadwal.view",
        name: "Lihat Jadwal",
        description: "Melihat daftar jadwal ibadah, doa, dan kegiatan jemaat",
        module: "jadwal",
      },
      {
        id: "jadwal.manage",
        name: "Kelola Jadwal",
        description: "Menambah, mengubah, dan menghapus jadwal kegiatan ibadah",
        module: "jadwal",
      },
    ],
  },
  {
    module: "renungan",
    title: "Renungan Harian",
    permissions: [
      {
        id: "renungan.view",
        name: "Lihat Renungan",
        description: "Membaca artikel renungan firman dan santapan harian",
        module: "renungan",
      },
      {
        id: "renungan.manage",
        name: "Kelola Renungan",
        description: "Menulis, menyunting, dan menghapus artikel renungan harian",
        module: "renungan",
      },
    ],
  },
  {
    module: "warta",
    title: "Warta Jemaat",
    permissions: [
      {
        id: "warta.view",
        name: "Lihat Warta",
        description: "Melihat daftar warta dan dokumen PDF jemaat",
        module: "warta",
      },
      {
        id: "warta.manage",
        name: "Kelola Warta",
        description: "Mengunggah, mengedit, dan menghapus dokumen warta jemaat",
        module: "warta",
      },
    ],
  },
  {
    module: "gallery",
    title: "Galeri Dokumentasi",
    permissions: [
      {
        id: "gallery.view",
        name: "Lihat Galeri",
        description: "Melihat album foto dan dokumentasi kegiatan gereja",
        module: "gallery",
      },
      {
        id: "gallery.manage",
        name: "Kelola Galeri",
        description: "Mengunggah, mengedit sorotan (highlight), dan menghapus foto galeri",
        module: "gallery",
      },
    ],
  },
  {
    module: "organization",
    title: "Struktur Organisasi",
    permissions: [
      {
        id: "organization.view",
        name: "Lihat Organisasi",
        description: "Melihat bagan struktur pengurus harian & koordinator sektor",
        module: "organization",
      },
      {
        id: "organization.manage",
        name: "Kelola Organisasi",
        description: "Menambah, mengedit informasi, dan mengatur urutan pengurus majelis",
        module: "organization",
      },
    ],
  },
  {
    module: "users",
    title: "Manajemen Pengguna",
    permissions: [
      {
        id: "users.view",
        name: "Lihat Pengguna",
        description: "Melihat daftar akun pengguna dan status persetujuan",
        module: "users",
      },
      {
        id: "users.manage",
        name: "Kelola Pengguna",
        description: "Menambah akun baru, mengubah data pengguna, dan menghapus akun",
        module: "users",
      },
    ],
  },
  {
    module: "roles",
    title: "Hak Akses & Perizinan",
    permissions: [
      {
        id: "roles.view",
        name: "Lihat Peran & Hak Akses",
        description: "Melihat matriks perizinan role dan hak akses pengguna",
        module: "roles",
      },
      {
        id: "roles.manage",
        name: "Kelola Peran & Hak Akses",
        description: "Mengubah perizinan role, menetapkan multi-role, dan kustomisasi perizinan user",
        module: "roles",
      },
    ],
  },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = PERMISSION_MODULES.flatMap(
  (group) => group.permissions,
);

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"], // Wildcard: Full akses ke seluruh modul dan aksi
  ADMIN: [
    "dashboard.view",
    "jadwal.view",
    "jadwal.manage",
    "renungan.view",
    "renungan.manage",
    "warta.view",
    "warta.manage",
    "gallery.view",
    "gallery.manage",
    "organization.view",
    "organization.manage",
    "users.view",
    "users.manage",
    "roles.view",
    "roles.manage",
  ],
  PHMJ: [
    "dashboard.view",
    "jadwal.view",
    "renungan.view",
    "warta.view",
    "gallery.view",
    "organization.view",
    "organization.manage",
  ],
  MAJELIS: [
    "dashboard.view",
    "jadwal.view",
    "renungan.view",
    "warta.view",
    "gallery.view",
    "organization.view",
  ],
  KOORSEK: [
    "dashboard.view",
    "jadwal.view",
    "warta.view",
    "gallery.view",
  ],
  PENGELOLA: [
    "dashboard.view",
    "jadwal.view",
    "jadwal.manage",
    "renungan.view",
    "renungan.manage",
    "warta.view",
    "warta.manage",
    "gallery.view",
    "gallery.manage",
  ],
};

/**
 * Cek apakah sekumpulan perizinan mengandung hak akses tertentu.
 * Mendukung superuser wildcard "*" atau modul wildcard "module.*".
 */
export function hasPermission(
  userPermissions: string[] = [],
  requiredPermission: string,
): boolean {
  if (userPermissions.includes("*")) return true;
  if (userPermissions.includes(requiredPermission)) return true;

  const [module] = requiredPermission.split(".");
  if (module && userPermissions.includes(`${module}.*`)) return true;

  return false;
}

/**
 * Cek apakah user memiliki minimal salah satu perizinan dari daftar yang diminta.
 */
export function hasAnyPermission(
  userPermissions: string[] = [],
  requiredPermissions: string[] = [],
): boolean {
  if (requiredPermissions.length === 0) return true;
  if (userPermissions.includes("*")) return true;
  return requiredPermissions.some((perm) => hasPermission(userPermissions, perm));
}

/**
 * Cek apakah user memiliki peran yang cocok (mendukung multiple roles per user).
 */
export function hasRole(
  userRoles: Role | Role[] | undefined,
  allowedRoles: Role | Role[],
): boolean {
  if (!userRoles) return false;
  const userRolesArr = Array.isArray(userRoles) ? userRoles : [userRoles];
  const allowedRolesArr = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // SUPER_ADMIN selalu lolos pemeriksaan role
  if (userRolesArr.includes("SUPER_ADMIN")) return true;

  return userRolesArr.some((r) => allowedRolesArr.includes(r));
}

/**
 * Mengkalkulasikan perizinan efektif gabungan dari semua role pengguna ditambah custom permissions pengguna.
 */
export function resolveEffectivePermissions(
  roles: Role[] = [],
  customPermissions: string[] = [],
  dynamicRoleMap?: Record<string, string[]>,
): string[] {
  const permSet = new Set<string>();

  if (roles.includes("SUPER_ADMIN")) {
    return ["*"];
  }

  for (const role of roles) {
    const rolePerms =
      (dynamicRoleMap && dynamicRoleMap[role]) || DEFAULT_ROLE_PERMISSIONS[role] || [];
    for (const p of rolePerms) {
      permSet.add(p);
    }
  }

  for (const cp of customPermissions) {
    permSet.add(cp);
  }

  return Array.from(permSet);
}
