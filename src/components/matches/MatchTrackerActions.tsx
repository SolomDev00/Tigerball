"use client";

import { Button } from "@/components/ui/button";
import {
  Volleyball,
  ShieldAlert,
  Activity,
  RefreshCcw,
  Download,
} from "lucide-react";

interface MatchTrackerActionsProps {
  pointInProgress: boolean;
  onServe: () => void;
  onOpenEndPoint: () => void;
  onPlayWhistle: () => void;
  onOpenSub: () => void;
  onExportExcel: () => void;
}

export function MatchTrackerActions({
  pointInProgress,
  onServe,
  onOpenEndPoint,
  onPlayWhistle,
  onOpenSub,
  onExportExcel,
}: MatchTrackerActionsProps) {
  return (
    <div className="flex justify-center gap-4 py-4">
      {!pointInProgress ? (
        <Button
          size="lg"
          className="w-48 text-lg h-14 rounded-full shadow-lg hover:scale-105 transition-transform bg-primary"
          onClick={onServe}
        >
          <Volleyball className="w-6 h-6 ml-2" /> إرسال (Serve)
        </Button>
      ) : (
        <Button
          size="lg"
          variant="destructive"
          className="w-48 text-lg h-14 rounded-full shadow-lg hover:scale-105 transition-transform"
          onClick={onOpenEndPoint}
        >
          <ShieldAlert className="w-6 h-6 ml-2" /> إنهاء النقطة
        </Button>
      )}

      <Button
        size="lg"
        variant="outline"
        className="w-14 h-14 rounded-full shadow-md hover:scale-105 transition-transform border-yellow-500 text-yellow-600 hover:bg-yellow-500/10"
        onClick={onPlayWhistle}
        title="إطلاق صافرة الحكم"
      >
        <Activity className="w-6 h-6" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-14 h-14 rounded-full shadow-md hover:scale-105 transition-transform border-primary text-primary hover:bg-primary/10"
        onClick={onOpenSub}
        title="تبديل لاعبين"
      >
        <RefreshCcw className="w-6 h-6" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-14 h-14 rounded-full shadow-md hover:scale-105 transition-transform border-primary text-primary hover:bg-primary/10"
        onClick={onExportExcel}
        title="تصدير الأحداث كملف Excel"
      >
        <Download className="w-6 h-6" />
      </Button>
    </div>
  );
}
