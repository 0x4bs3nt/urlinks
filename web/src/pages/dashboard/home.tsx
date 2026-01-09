import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardHome() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <h2 className="text-2xl font-bold text-foreground">Overview</h2>
                <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>
            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Chart Placeholder</CardTitle>
                        <CardDescription>Chart will be displayed here</CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Table Placeholder</CardTitle>
                        <CardDescription>Table will be displayed here</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}
