"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const database_1 = require("../../../config/database");
class DashboardRepository {
    async countJadwal(filter) {
        if (filter?.upcomingOnly) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return database_1.prisma.jadwal.count({
                where: {
                    date: { gte: today },
                },
            });
        }
        return database_1.prisma.jadwal.count();
    }
    async countRenungan() {
        return database_1.prisma.renungan.count();
    }
    async countWarta() {
        return database_1.prisma.warta.count();
    }
    async countGallery(filter) {
        if (filter?.highlightedOnly) {
            return database_1.prisma.gallery.count({
                where: { highlight: true },
            });
        }
        return database_1.prisma.gallery.count();
    }
    async countOrganization(filter) {
        if (filter?.category) {
            return database_1.prisma.organization.count({
                where: { category: filter.category },
            });
        }
        return database_1.prisma.organization.count();
    }
    async countUsers(filter) {
        if (filter?.status) {
            return database_1.prisma.user.count({
                where: { status: filter.status },
            });
        }
        return database_1.prisma.user.count();
    }
    async getStatistics() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [jadwalTotal, jadwalUpcoming, renunganTotal, wartaTotal, galleryTotal, galleryHighlighted, galleryShowInHome, orgTotal, orgPH, orgKS, orgActive, usersTotal, usersPending, usersApproved, usersRejected, galleryByCategory, renunganByAuthor, usersByRole, jadwalDates, wartaDates,] = await Promise.all([
            database_1.prisma.jadwal.count(),
            database_1.prisma.jadwal.count({ where: { date: { gte: today } } }),
            database_1.prisma.renungan.count(),
            database_1.prisma.warta.count(),
            database_1.prisma.gallery.count(),
            database_1.prisma.gallery.count({ where: { highlight: true } }),
            database_1.prisma.gallery.count({ where: { showInHome: true } }),
            database_1.prisma.organization.count(),
            database_1.prisma.organization.count({ where: { category: "PENGURUS_HARIAN" } }),
            database_1.prisma.organization.count({ where: { category: "KOORDINATOR_SEKTOR" } }),
            database_1.prisma.organization.count({ where: { isActive: true } }),
            database_1.prisma.user.count(),
            database_1.prisma.user.count({ where: { status: "PENDING" } }),
            database_1.prisma.user.count({ where: { status: "APPROVED" } }),
            database_1.prisma.user.count({ where: { status: "REJECTED" } }),
            database_1.prisma.gallery.groupBy({
                by: ["category"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            }),
            database_1.prisma.renungan.groupBy({
                by: ["author"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            }),
            database_1.prisma.user.groupBy({
                by: ["role"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            }),
            database_1.prisma.jadwal.findMany({
                select: { date: true },
                orderBy: { date: "asc" },
            }),
            database_1.prisma.warta.findMany({
                select: { publishedAt: true },
                orderBy: { publishedAt: "asc" },
            }),
        ]);
        const formatMonth = (d) => new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(d);
        const jadwalMonthMap = new Map();
        for (const j of jadwalDates) {
            const m = formatMonth(new Date(j.date));
            jadwalMonthMap.set(m, (jadwalMonthMap.get(m) || 0) + 1);
        }
        const jadwalByMonth = Array.from(jadwalMonthMap.entries()).map(([name, count]) => ({
            name,
            count,
        }));
        const wartaMonthMap = new Map();
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
exports.DashboardRepository = DashboardRepository;
//# sourceMappingURL=DashboardRepository.js.map