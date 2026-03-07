import { Metadata } from "next";
import { getPendingSubmissions } from "@/app/actions/review-queue";
import { ReviewQueueClient } from "@/components/review/review-queue-client";

export const metadata: Metadata = {
  title: "Review Queue — Commons Internal",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ secret?: string }>;
}

export default async function ReviewPage({ searchParams }: Props) {
  const { secret } = await searchParams;

  if (!secret || secret !== process.env.REVIEW_SECRET) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-4xl font-mono font-bold text-error mb-4">403</p>
          <h1 className="font-mono text-xl font-bold text-foreground lowercase mb-3">
            access denied
          </h1>
          <p className="text-xs text-foreground-ghost font-mono">
            // this page requires a valid review secret
          </p>
        </div>
      </main>
    );
  }

  const submissions = await getPendingSubmissions(secret);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
              [internal]
            </span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-foreground lowercase">
            review queue
          </h1>
          <p className="mt-1 text-xs text-foreground-muted font-mono">
            review pending skill submissions. approved skills are published immediately.
          </p>
        </div>

        <ReviewQueueClient secret={secret} initialSubmissions={submissions} />
      </div>
    </main>
  );
}
