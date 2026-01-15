import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "neurooz-pre-login-brain-dumps";

interface PreLoginBrainDumpEntry {
  id: string;
  content: string;
  timestamp: number;
}

/**
 * Syncs pre-login brain dumps from localStorage to the user's account
 * Should be called after successful authentication
 */
export async function syncPreLoginBrainDumps(): Promise<{
  synced: number;
  failed: number;
  errors: string[];
}> {
  const result = {
    synced: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      result.errors.push("No authenticated user found");
      return result;
    }

    // Get pre-login entries from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // No entries to sync
      return result;
    }

    let entries: PreLoginBrainDumpEntry[];
    try {
      entries = JSON.parse(stored);
    } catch (e) {
      result.errors.push("Failed to parse stored brain dumps");
      return result;
    }

    if (!Array.isArray(entries) || entries.length === 0) {
      return result;
    }

    // Sync each entry to the database
    for (const entry of entries) {
      try {
        const { error } = await supabase
          .from("brain_dump_entries")
          .insert({
            user_id: user.id,
            content: entry.content,
            created_at: new Date(entry.timestamp).toISOString(),
            status: "captured", // Initial status
            source: "pre-login", // Mark as pre-login entry
          });

        if (error) {
          result.failed++;
          result.errors.push(`Failed to sync entry ${entry.id}: ${error.message}`);
        } else {
          result.synced++;
        }
      } catch (e) {
        result.failed++;
        result.errors.push(`Exception syncing entry ${entry.id}: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    }

    // Clear localStorage after successful sync
    if (result.synced > 0) {
      localStorage.removeItem(STORAGE_KEY);
    }

    return result;
  } catch (e) {
    result.errors.push(`Sync failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Check if there are pre-login brain dumps waiting to be synced
 */
export function hasPreLoginBrainDumps(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  try {
    const entries = JSON.parse(stored);
    return Array.isArray(entries) && entries.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get count of pre-login brain dumps
 */
export function getPreLoginBrainDumpCount(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return 0;

  try {
    const entries = JSON.parse(stored);
    return Array.isArray(entries) ? entries.length : 0;
  } catch {
    return 0;
  }
}
