
export interface FileItemType {
    name: string,
    type: string,
    size: number,
    file: File,
    fileId: string | null
}

export type CallState = 'idle'|'call_incoming'|'call_accepted'