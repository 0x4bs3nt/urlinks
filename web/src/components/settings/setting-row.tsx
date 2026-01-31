export function SettingsRow({
    title,
    description,
    right,
}: {
    title: string;
    description?: string;
    right: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-lg">{title}</p>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {right}
        </div>
    );
}
