export interface UserNote {
  note: string;
  update_date: string;
}

export type NotesMap = Record<string, UserNote>;
