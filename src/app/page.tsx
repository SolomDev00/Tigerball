import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users, Volleyball, Activity } from "lucide-react";
import { getDashboardStats } from "./actions/dashboard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export const revalidate = 60; // Refresh every minute

export default async function Home() {
  const res = await getDashboardStats();
  const stats = res.success ? res.data : null;

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground">
        فشل في تحميل إحصائيات لوحة التحكم.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            إحصائيات وتحليلات أداء اللاعبين والمباريات المسجلة.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary border border-primary/10">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-bold">تحديث حي للبيانات</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Players Count Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">
              اللاعبين المسجلين
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.playerCount}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              إجمالي اللاعبين في النظام
            </p>
          </CardContent>
        </Card>

        {/* Matches Count Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold">
              المباريات الملعوبة
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
              <Volleyball className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.matchCount}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              مباريات مكتملة تم تتبعها
            </p>
          </CardContent>
        </Card>

        {/* Top Player Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 group overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-lg font-bold">اللاعب المتصدر</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 group-hover:rotate-12 transition-transform">
              <Trophy className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-black mt-1 truncate">
              {stats.topPlayer?.name || "لا يوجد بيانات"}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-bold">
              {stats.topPlayer
                ? `${stats.topPlayer.score} نقطة تقييم`
                : "ابدأ تتبع المباريات"}
            </p>
          </CardContent>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
        </Card>
      </div>

      {/* Analytics Charts Module */}
      <DashboardCharts
        topScorers={stats.charts.topScorers}
        actionDistribution={stats.charts.actionDistribution}
      />
    </div>
  );
}
