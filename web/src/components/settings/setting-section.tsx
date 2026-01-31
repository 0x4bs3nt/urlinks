export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-2">
            <h2 className="text-2xl font-semibold pt-2 pb-2">{title}</h2>
            {children}
        </section>
    );
}
