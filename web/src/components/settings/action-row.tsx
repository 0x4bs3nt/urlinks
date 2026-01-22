import { Button } from '@/components/ui/button';

export function ActionRow({
    title,
    description,
    action,
    destructive,
}: {
    title: string;
    description?: string;
    action: string;
    destructive?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-lg">{title}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            <Button
                variant={destructive ? 'default' : 'outline'}
                className={
                    destructive
                        ? 'rounded-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 px-4 py-4'
                        : 'px-4 py-4 rounded-3xl bg-muted'
                }
            >
                {action}
            </Button>
        </div>
    );
}
