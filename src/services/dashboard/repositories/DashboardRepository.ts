import { prisma } from "../../../config/database";
import type { IDashboardRepositories } from "../interfaces/IDashboardRepositories";
import type { DashboardStats } from "../data_interfaces/DashboardInterface";

export class DashboardRepository implements IDashboardRepositories {
  async countJadwal(filter?: { upcomingOnly?: boolean }): Promise<number> {
    if (filter?.upcomingOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return prisma.jadwal.count({
        where: {
          date: { gte: today },
        },
      });
    }
    return prisma.jadwal.count();
  }

  async countRenungan(): Promise<number> {
    return prisma.renungan.count();
  }

  async countWarta(): Promise<number> {
    return prisma.warta.count();
  }

  async countGallery(filter?: { highlightedOnly?: boolean }): Promise<number> {
    if (filter?.highlightedOnly) {
      return prisma.gallery.count({
        where: { highlight: true },
      });
    }
    return prisma.gallery.count();
  }

  async countOrganization(filter?: {
    category?: "PENGURUS_HARIAN" | "KOORDINATOR_SEKTOR";
  }): Promise<number> {
    if (filter?.category) {
      return prisma.organization.count({
        where: { category: filter.category },
      });
    }
    return prisma.organization.count();
  }

  async countUsers(filter?: {
    status?: "PENDING" | "APPROVED" | "REJECTED";
  }): Promise<number> {
    if (filter?.status) {
      return prisma.user.count({
        where: { status: filter.status },
      });
    }
    return prisma.user.count();
  }

  async getStatistics(): Promise<DashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      jadwalTotal,
      jadwalUpcoming,
      renunganTotal,
      wartaTotal,
      galleryTotal,
      galleryHighlighted,
      galleryShowInHome,
      orgTotal,
      orgPH,
      orgKS,
      orgActive,
      usersTotal,
      usersPending,
      usersApproved,
      usersRejected,
      galleryByCategory,
      renunganByAuthor,
      usersByRole,
      jadwalDates,
      wartaDates,
    ] = await Promise.all([
      prisma.jadwal.count(),
      prisma.jadwal.count({ where: { date: { gte: today } } }),
      prisma.renungan.count(),
      prisma.warta.count(),
      prisma.gallery.count(),
      prisma.gallery.count({ where: { highlight: true } }),
      prisma.gallery.count({ where: { showInHome: true } }),
      prisma.organization.count(),
      prisma.organization.count({ where: { category: "PENGURUS_HARIAN" } }),
      prisma.organization.count({ where: { category: "KOORDINATOR_SEKTOR" } }),
      prisma.organization.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "APPROVED" } }),
      prisma.user.count({ where: { status: "REJECTED" } }),
      prisma.gallery.groupBy({
        by: ["category"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.renungan.groupBy({
        by: ["author"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      prisma.jadwal.findMany({
        select: { date: true },
        orderBy: { date: "asc" },
      }),
      prisma.warta.findMany({
        select: { publishedAt: true },
        orderBy: { publishedAt: "asc" },
      }),
    ]);

    const formatMonth = (d: Date) =>
      new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(d);

    const jadwalMonthMap = new Map<string, number>();
    for (const j of jadwalDates) {
      const m = formatMonth(new Date(j.date));
      jadwalMonthMap.set(m, (jadwalMonthMap.get(m) || 0) + 1);
    }
    const jadwalByMonth = Array.from(jadwalMonthMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    const wartaMonthMap = new Map<string, number>();
    for (const w of wartaDates) {
      const m = formatMonth(new Date(w.publishedAt));
      wartaMonthMap.set(m, (wartaMonthMap.get(m) || 0) + 1);
    }
    const wartaByMonth = Array.from(wartaMonthMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    return {
      counts: {
        jadwal: jadwalTotal,
        renungan: renunganTotal,
        warta: wartaTotal,
        gallery: galleryTotal,
        organization: orgTotal,
        users: usersTotal,
      },
      jadwal: {
        total: jadwalTotal,
        upcoming: jadwalUpcoming,
        past: Math.max(0, jadwalTotal - jadwalUpcoming),
        byMonth: jadwalByMonth,
      },
      renungan: {
        total: renunganTotal,
        byAuthor: renunganByAuthor.map((r) => ({
          name: r.author || "Anonim",
          count: r._count.id,
        })),
      },
      warta: {
        total: wartaTotal,
        byMonth: wartaByMonth,
      },
      gallery: {
        total: galleryTotal,
        highlighted: galleryHighlighted,
        showInHome: galleryShowInHome,
        byCategory: galleryByCategory.map((g) => ({
          name: g.category || "Umum",
          count: g._count.id,
        })),
      },
      organization: {
        total: orgTotal,
        pengurusHarian: orgPH,
        koordinatorSektor: orgKS,
        activeCount: orgActive,
        inactiveCount: Math.max(0, orgTotal - orgActive),
      },
      users: {
        total: usersTotal,
        pending: usersPending,
        approved: usersApproved,
        rejected: usersRejected,
        byRole: usersByRole.map((u) => ({
          name: u.role,
          count: u._count.id,
        })),
      },
    };
  }
}
