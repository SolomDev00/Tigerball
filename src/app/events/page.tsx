import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export const revalidate = 0; // Disable static caching for real-time events

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-primary flex items-center justify-center gap-3">
          <CalendarDays className="w-10 h-10" />
          الأخبار والأحداث
        </h1>
        <p className="text-muted-foreground text-lg">
          تابع أحدث الأخبار والفعاليات والبطولات الخاصة بنا.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
          لا يوجد أخبار أو أحداث في الوقت الحالي.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10"
            >
              {/* Image Section */}
              {event.images && event.images.length > 0 ? (
                <div className="w-full h-64 overflow-hidden relative bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                      +{event.images.length - 1} صور
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-primary/5 flex items-center justify-center text-primary/30">
                  <CalendarDays className="w-16 h-16" />
                </div>
              )}

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>
                    {event.subtitle && (
                      <p className="text-muted-foreground line-clamp-2">
                        {event.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    الحدث نشر في{" "}
                    {format(new Date(event.createdAt), "d MMMM yyyy", {
                      locale: ar,
                    })}
                  </span>
                  <button className="flex items-center gap-1.5 text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors font-semibold">
                    <Heart className="w-5 h-5 fill-rose-500" />
                    <span>{event.likes}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
