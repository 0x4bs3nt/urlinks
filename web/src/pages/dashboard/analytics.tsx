import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAnalytics() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
                <p className="text-muted-foreground">View your link analytics and statistics</p>
            </div>
            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics Charts</CardTitle>
                        <CardDescription>Your analytics will be displayed here</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
