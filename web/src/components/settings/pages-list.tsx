import { Button } from '@/components/ui/button';

export function PagesList({ pages }: { pages: { id: string; username: string }[] }) {
    return (
        <div className="space-y-4">
            {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted" />
                        <span className="text-xl font-semibold">@{page.username}</span>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="lg" className="rounded-3xl px-4 py-4 bg-muted">
                            Edit
                        </Button>
                        <Button variant="destructive" size="lg" className="rounded-3xl px-4 py-4">
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
