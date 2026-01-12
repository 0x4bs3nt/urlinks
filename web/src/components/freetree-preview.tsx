import { Youtube, Twitter, Instagram, Facebook, Linkedin, Github, Globe } from 'lucide-react';

export interface FreetreeLink {
    id: string;
    title: string;
    url: string;
    description?: string;
    platform?: string;
}

export interface FreetreeProfile {
    displayName: string;
    bio?: string;
    showWatermark?: boolean;
    links: FreetreeLink[];
}

interface FreetreePreviewProps {
    profile: FreetreeProfile;
}

const platformIcons = {
    youtube: Youtube,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    github: Github,
    website: Globe,
};

export function FreetreePreview({ profile }: FreetreePreviewProps) {
    return (
        <div className="relative h-full w-full bg-muted/30 rounded-xl p-4 flex items-center justify-center">
            {/* Mock Phone Frame */}
            <div className="relative w-full max-w-[320px] aspect-[9/19.5] bg-background rounded-[2.5rem] shadow-2xl border-[6px] border-muted overflow-hidden">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-muted rounded-b-xl z-10" />

                {/* Scrollable Content */}
                <div className="h-full overflow-y-auto px-4 py-8 scrollbar-hide">
                    {/* Profile Header */}
                    <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                            <span className="text-xl font-semibold text-primary">
                                {profile.displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-lg font-bold text-foreground mb-1">@{profile.displayName || 'username'}</h1>
                        <p className="text-xs text-muted-foreground mb-2">
                            freetree.dev/{profile.displayName || 'username'}
                        </p>
                        {profile.bio && (
                            <p className="text-sm text-foreground/80 px-2 leading-relaxed">{profile.bio}</p>
                        )}
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                        {profile.links.length === 0 ? (
                            <div className="text-center py-8 animate-in fade-in duration-500">
                                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                                    <Globe className="w-7 h-7 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm text-muted-foreground">No links yet</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">
                                    Add your first link to get started
                                </p>
                            </div>
                        ) : (
                            profile.links.map((link, index) => {
                                const Icon =
                                    link.platform && platformIcons[link.platform as keyof typeof platformIcons]
                                        ? platformIcons[link.platform as keyof typeof platformIcons]
                                        : Globe;

                                return (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group animate-in fade-in slide-in-from-bottom-2 duration-500"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="bg-card border border-border rounded-lg p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                                    <Icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm text-foreground mb-1 truncate">
                                                        {link.title}
                                                    </h3>
                                                    {link.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {link.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {profile.showWatermark !== false && (
                        <div className="text-center mt-8 pb-6 animate-in fade-in duration-700 delay-500">
                            <p className="text-xs text-muted-foreground/60">
                                Powered by{' '}
                                <a
                                    href="https://github.com/0x4bs3nt/freetree"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary transition-colors"
                                >
                                    freetree
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
