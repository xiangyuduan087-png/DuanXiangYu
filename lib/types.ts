export const designCategories = ['海报', 'Banner', 'IP', '字体', '图标'] as const;
export const videoCategories = ['TVC种草', '剧集', '娱乐向', '短片'] as const;
export type DesignCategory = typeof designCategories[number];
export type VideoCategory = typeof videoCategories[number];
export type Direction = 'design' | 'video';
export type MediaImage = { src: string; thumbnail?: string; original?: string; alt: string; caption?: string; width: number; height: number };
export type DetailContent = {
  background?: string; goal?: string; constraints?: string; audience?: string; scope?: string;
  decisions?: string[]; process?: { title: string; description?: string }[];
  highlights?: string[]; tools?: string[]; outcome?: string; reflection?: string;
  images: MediaImage[];
};
type BaseProject<D extends Direction, C> = {
  id: string; title: string; direction: D; categories: C[]; cover: MediaImage | null;
  summary: string; responsibility: string | null; date: string | null;
  featured: boolean; order: number; isPlaceholder: boolean; placeholderLabel?: string; detail: DetailContent;
  titleTemporary?: boolean; classificationPending?: boolean; classificationReason?: string; groupEvidence?: string;
};
export type DesignProject = BaseProject<'design', DesignCategory>;
export type VideoProject = BaseProject<'video', VideoCategory> & {
  video: string | null; duration: string | null; processMedia: MediaImage[];
  episodes?: { id: string; title: string; src: string; duration: string; width: number; height: number; poster: string; bilibiliUrl?:string }[];
  processGroups?: { label: string; episodeId: string; images: MediaImage[]; documents: { title: string; src: string; text: string }[] }[];
};
export type Project = DesignProject | VideoProject;
export type PersonalProfile = {
  name: string | null; positioning: string; positioningConfirmed: boolean; valueProposition: string;
  introduction: string | null; location: string | null; availability: string | null;
  skills: { title: string; description: string | null }[];
  experience: { company: string; position: string; period: string; responsibilities: string[]; outcomes?: string[] }[];
  education: { school: string; major: string; period: string; qualification?: string }[];
  resume: { src: string; filename: string; updatedAt?: string } | null;
  email: string | null; wechat: string | null; socials: { name: string; url: string }[];
};

