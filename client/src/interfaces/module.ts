export interface Module {
    id?: string;
    name?: string;
    description?: string;
    duration?: string;
    status?: boolean;
    createdAt?: Date;
    chapters?: IChapter[];
  }
  
  export interface IChapter {
    title: string;
    description?: string;
    videoUrl?: string;
    videoThumbnail?: object;
    videoSection?: string;
    videoLength?: number;
    videoPlayer?: string;
    }
    