const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos

interface AttemptRecord {
    count: number;
    blockedUntil?: number;
}

const attempts = new Map<string, AttemptRecord>();

export function isBlocked(email: string): boolean {
    const record = attempts.get(email);
    if (!record?.blockedUntil) return false;
    if (Date.now() < record.blockedUntil) return true;
    attempts.delete(email);
    return false;
}

export function recordFailedAttempt(email: string): number {
    const record = attempts.get(email) ?? { count: 0 };
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
        record.blockedUntil = Date.now() + BLOCK_DURATION_MS;
    }
    attempts.set(email, record);
    return record.count;
}

export function resetAttempts(email: string): void {
    attempts.delete(email);
}
