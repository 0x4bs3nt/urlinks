import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardLinks() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <h2 className="text-2xl font-bold text-foreground">Links</h2>
                <p className="text-muted-foreground">Manage your shortened links</p>
            </div>
            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Links Table</CardTitle>
                        <CardDescription>Your links will be displayed here</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
