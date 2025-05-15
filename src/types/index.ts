/**
 * Represents a single user note entry.
 * Includes both the note content and the last update timestamp.
 */
export interface UserNote {
  /** The textual note associated with the Twitch user. */
  note: string;

  /** ISO string of the date/time the note was last updated. */
  update_date: string;
}

/**
 * A map of Twitch usernames to their corresponding notes.
 * Keys are lowercase login names; values are UserNote objects.
 */
export type NotesMap = Record<string, UserNote>;

/**
 * Interface for storage providers used to persist and retrieve notes.
 * Allows swapping out Chrome extension storage with mocks or alternatives.
 */
export interface IStorageProvider {
  /**
   * Retrieves all notes from storage.
   * @returns {Promise<NotesMap>} The currently stored notes map.
   */
  get(): Promise<NotesMap>;

  /**
   * Saves the given notes map into storage.
   * @param {NotesMap} notes - The notes to persist.
   * @returns {Promise<void>} Resolves after successful write.
   */
  set(notes: NotesMap): Promise<void>;

  /**
   * Returns the number of bytes used by stored notes.
   * @returns {Promise<number>} Used to visualize storage consumption.
   */
  getBytesUsed(): Promise<number>;
}
