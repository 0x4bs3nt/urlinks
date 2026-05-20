import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { LaptopMinimalIcon, ShieldAlertIcon } from 'lucide-react';

import { removeHeaderToken } from '@/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    type ActiveSession,
    useLogout,
    useRevokeOtherSessions,
    useRevokeSession,
    useSessions,
} from '@/services/auth/session';
import { clearAuthStore } from '@/store/auth';

type PendingAction =
    | { type: 'logout-current' }
    | { type: 'revoke-other'; session: ActiveSession }
    | { type: 'revoke-others' }
    | null;

const formatSessionDate = (value: string) =>
    new Date(value).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

export default function AccountSessionsPage() {
    const navigate = useNavigate();
    const { data: sessions = [], isLoading } = useSessions();
    const logoutMutation = useLogout();
    const revokeSessionMutation = useRevokeSession();
    const revokeOtherSessionsMutation = useRevokeOtherSessions();
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const otherSessionsCount = useMemo(
        () => sessions.filter((session) => !session.is_current).length,
        [sessions]
    );

    const closeDialog = () => {
        if (
            logoutMutation.isPending ||
            revokeSessionMutation.isPending ||
            revokeOtherSessionsMutation.isPending
        ) {
            return;
        }

        setPendingAction(null);
    };

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } finally {
            removeHeaderToken();
            clearAuthStore();
            navigate('/login');
        }
    };

    const confirmPendingAction = async () => {
        if (!pendingAction) {
            return;
        }

        if (pendingAction.type === 'logout-current') {
            await handleLogout();
            return;
        }

        if (pendingAction.type === 'revoke-other') {
            await revokeSessionMutation.mutateAsync(pendingAction.session.id);
            toast.success('Session revoked.');
            setPendingAction(null);
            return;
        }

        const result = await revokeOtherSessionsMutation.mutateAsync();
        toast.success(result.detail);
        setPendingAction(null);
    };

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Active Sessions</h2>
                    <p className="text-muted-foreground">
                        These are the devices and browsers currently signed into your account.
                    </p>
                </div>
                <Button
                    variant="destructive"
                    disabled={otherSessionsCount === 0 || revokeOtherSessionsMutation.isPending}
                    onClick={() => setPendingAction({ type: 'revoke-others' })}
                >
                    Log out all other sessions
                </Button>
            </div>

            <div className="px-4 lg:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Session inventory</CardTitle>
                        <CardDescription>
                            Revoking a session removes access immediately, even if its access token has not expired yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Loading sessions…</div>
                        ) : sessions.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                No active sessions found.
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <article key={session.id} className="rounded-xl border p-4">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <LaptopMinimalIcon className="size-4 text-muted-foreground" />
                                                <h3 className="font-medium text-foreground">
                                                    {session.user_agent || 'Unknown device'}
                                                </h3>
                                                {session.is_current ? <Badge>Current</Badge> : null}
                                            </div>

                                            <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                                                <div>
                                                    <dt className="font-medium text-foreground">IP address</dt>
                                                    <dd>{session.ip_address || 'Unavailable'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-medium text-foreground">Created</dt>
                                                    <dd>{formatSessionDate(session.created_at)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-medium text-foreground">Last active</dt>
                                                    <dd>{formatSessionDate(session.last_seen_at)}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-medium text-foreground">Expires</dt>
                                                    <dd>{formatSessionDate(session.expires_at)}</dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="flex shrink-0 items-center">
                                            {session.is_current ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setPendingAction({ type: 'logout-current' })}
                                                >
                                                    Log out this device
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setPendingAction({ type: 'revoke-other', session })}
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={Boolean(pendingAction)} onOpenChange={(open) => (!open ? closeDialog() : undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <ShieldAlertIcon className="size-5" />
                        </div>
                        <AlertDialogTitle>
                            {pendingAction?.type === 'logout-current'
                                ? 'Log out this device?'
                                : pendingAction?.type === 'revoke-other'
                                  ? 'Revoke this session?'
                                  : 'Log out all other sessions?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingAction?.type === 'logout-current'
                                ? 'This will revoke the current session on the server and return you to the login screen.'
                                : pendingAction?.type === 'revoke-other'
                                  ? 'The selected device will lose access on its next authenticated request.'
                                  : 'Every other active session will be revoked immediately. Your current session will stay signed in.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmPendingAction}
                            disabled={
                                logoutMutation.isPending ||
                                revokeSessionMutation.isPending ||
                                revokeOtherSessionsMutation.isPending
                            }
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
