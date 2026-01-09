import { useState } from 'react';

import { Plus, Trash2, GripVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FreetreePreview, type FreetreeLink, type FreetreeProfile } from '@/components/freetree-preview';

const socialPlatforms = [
    { value: 'website', label: 'Website' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
];

export default function DashboardHome() {
    const [profile, setProfile] = useState<FreetreeProfile>({
        displayName: '',
        links: [],
    });

    const addLink = () => {
        const newLink: FreetreeLink = {
            id: Date.now().toString(),
            title: '',
            url: '',
            description: '',
            platform: 'website',
        };

        setProfile((prev) => ({
            ...prev,
            links: [...prev.links, newLink],
        }));
    };

    const updateLink = (id: string, field: keyof FreetreeLink, value: string) => {
        setProfile((prev) => ({
            ...prev,
            links: prev.links.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
        }));
    };

    const deleteLink = (id: string) => {
        setProfile((prev) => ({
            ...prev,
            links: prev.links.filter((link) => link.id !== id),
        }));
    };

    const updateDisplayName = (value: string) => {
        const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');

        setProfile((prev) => ({ ...prev, displayName: sanitized }));
    };

    return (
        <div className="h-full w-full overflow-hidden">
            <div className="h-full grid lg:grid-cols-[1fr_600px] gap-6 p-4 md:p-6 overflow-hidden">
                {/* Editor Section */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin">
                    {/* Display Name Section */}
                    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName" className="font-medium text-foreground">
                                    Display Name
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                        freetree.dev/
                                    </div>
                                    <Input
                                        id="displayName"
                                        value={profile.displayName}
                                        onChange={(e) => updateDisplayName(e.target.value)}
                                        placeholder="username"
                                        className="pl-[110px] font-medium bg-background border-border focus:border-primary transition-colors"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Only lowercase letters, numbers, and underscores
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Links Section */}
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle>Your Links</CardTitle>
                                <CardDescription>
                                    You will be able to track analytics for each link after publishing your profile.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={addLink}
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Link
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {profile.links.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground mb-1">No links yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Click "Add Link" to create your first link
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {profile.links.map((link) => (
                                        <div
                                            key={link.id}
                                            className="border border-border rounded-lg p-4 bg-background hover:border-primary/30 transition-all group"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="cursor-grab active:cursor-grabbing mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    {/* Platform Selector */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-muted-foreground">
                                                            Platform
                                                        </Label>
                                                        <Select
                                                            value={link.platform}
                                                            onValueChange={(value) =>
                                                                updateLink(link.id, 'platform', value)
                                                            }
                                                        >
                                                            <SelectTrigger className="bg-background border-border focus:border-primary transition-colors">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {socialPlatforms.map((platform) => (
                                                                    <SelectItem
                                                                        key={platform.value}
                                                                        value={platform.value}
                                                                    >
                                                                        {platform.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Title */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-muted-foreground">
                                                            Title
                                                        </Label>
                                                        <Input
                                                            value={link.title}
                                                            onChange={(e) =>
                                                                updateLink(link.id, 'title', e.target.value)
                                                            }
                                                            placeholder="My awesome link"
                                                            className="bg-background border-border focus:border-primary transition-colors"
                                                        />
                                                    </div>

                                                    {/* URL */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-muted-foreground">
                                                            URL
                                                        </Label>
                                                        <Input
                                                            value={link.url}
                                                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                                            placeholder="https://example.com"
                                                            className="bg-background border-border focus:border-primary transition-colors"
                                                        />
                                                    </div>

                                                    {/* Description */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-muted-foreground">
                                                            Description (optional)
                                                        </Label>
                                                        <Textarea
                                                            value={link.description}
                                                            onChange={(e) =>
                                                                updateLink(link.id, 'description', e.target.value)
                                                            }
                                                            placeholder="A brief description of this link"
                                                            className="bg-background border-border focus:border-primary transition-colors resize-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteLink(link.id)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Save Section */}
                    <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-4 pb-2">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                            Save & Publish
                        </Button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="hidden lg:flex flex-col sticky top-0 h-[calc(100vh-7rem)]">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-foreground mb-1">Live Preview</h2>
                        <p className="text-sm text-muted-foreground">See how your freetree page looks in real-time</p>
                    </div>
                    <div className="flex-1 min-h-0">
                        <FreetreePreview profile={profile} />
                    </div>
                </div>
            </div>
        </div>
    );
}
