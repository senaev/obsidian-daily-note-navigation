export const FILE_OPEN_TYPES = ["Active", "New tab", "New window", "Split right", "Split down"] as const;
export type FileOpenType = (typeof FILE_OPEN_TYPES)[number];
