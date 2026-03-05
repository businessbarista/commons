import { Metadata } from "next";
import { getPendingSubmissions } from "@/app/actions/review-queue";
import { ReviewQueueClient } from "@/components/review/review-queue-client";

export const metadata: Metadata = {
  title: "Review Queue — Commons Internal",
  robots: "noindex, nofollow",
};

// Force dynamic rendering — needs to read search params at request time
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ secret?: string }>;
}

export default async function ReviewPage({ searchParams }: Props) {
  const { secret } = await searchParams;

  // Gate: must have valid secret
  if (!secret || secret !== process.env.REVIEW_SECRET) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-3">
          Access Denied
        </h1>
        <p className="text-foreground-muted text-sm">
          This page requires a valid review secret.
        </p>
      </main>
    );
  }

  const submissions = await getPendingSubmissions(secret);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
            Internal
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Review Queue
        </h1>
        <p className="mt-1 text-foreground-secondary text-sm">
          Review pending skill submissions. Approved skills are published
          immediately.
        </p>
      </div>

      <ReviewQueueClient secret={secret} initialSubmissions={submissions} />
    </main>
  );
}
