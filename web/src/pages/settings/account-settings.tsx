import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

import { SettingsSection } from '@/components/settings/setting-section';
import { SettingsRow } from '@/components/settings/setting-row';
import { ActionRow } from '@/components/settings/action-row';
import { PagesList } from '@/components/settings/pages-list';

const pages = [
    { id: '1', username: 'agustin' },
    { id: '2', username: 'aguscruiz' },
    { id: '3', username: 'memes' },
];

export default function AccountSettingsPage() {
    return (
        <div className="min-h-screen w-full">
            <header className="max-w-3xl mx-auto flex px-4 py-6 pt-12">
                <img src="/urlinks.svg" alt="Urlinks" className="h-8 w-auto" />
            </header>

            <main className="mx-auto max-w-3xl px-4 space-y-10">
                <SettingsSection title="Your pages">
                    <Card className="border border-border shadow-sm">
                        <div className="px-6 pb-4">
                            <h3 className="text-xl font-semibold">Create or customize your pages</h3>
                            <p className="text-sm text-muted-foreground">
                                You can create up to 5 pages in your account
                            </p>
                        </div>

                        <CardContent className="pt-0">
                            <PagesList pages={pages} />
                        </CardContent>

                        <div className="border-t border-border" />

                        <CardContent>
                            <Button className="rounded-full text-md bg-black text-white px-4 py-2 hover:bg-black/90">
                                <Plus className="mr-1 h-4 w-4" />
                                New page
                            </Button>
                        </CardContent>
                    </Card>
                </SettingsSection>

                <SettingsSection title="Notification preferences">
                    <Card className="border border-border shadow-sm">
                        <CardContent className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <SettingsRow
                                    key={i}
                                    title="Placeholder"
                                    description="placeholder text"
                                    right={
                                        <Switch
                                            className="
                                               data-[state=checked]:bg-black
                                               [&>span]:bg-muted"
                                        />
                                    }
                                />
                            ))}
                        </CardContent>
                    </Card>
                </SettingsSection>

                <SettingsSection title="Your account">
                    <Card className="border border-border shadow-sm">
                        <CardContent className="space-y-6">
                            <SettingsRow
                                title='Show "powered by urlinks" in your page footer'
                                description="You can support urlinks by leaving it on, it helps people find out about this app and it means a lot us."
                                right={
                                    <Switch
                                        className="
                                               data-[state=checked]:bg-black
                                               [&>span]:bg-muted"
                                    />
                                }
                            />

                            <ActionRow
                                title="Change email"
                                description="Change your current email used for login"
                                action="Change email"
                            />

                            <ActionRow
                                title="Change password"
                                description="Change your current password"
                                action="Change password"
                            />

                            <ActionRow
                                title="Log out"
                                description="Close your session and log out of urlinks"
                                action="Logout"
                            />

                            <ActionRow
                                title="Delete account"
                                description="Permanently delete your account and information"
                                action="Delete account"
                                destructive
                            />
                        </CardContent>
                    </Card>
                </SettingsSection>

                <footer className="py-5 text-center text-sm text-muted-foreground">2026 urlinks etc.</footer>
            </main>
        </div>
    );
}
