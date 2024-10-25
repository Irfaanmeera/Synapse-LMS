export interface IModule {
    id?: string;
    name?: string;
    courseId?: string;
    description?: string;
    module?: string;
    duration?: string;
    status?: boolean;
    createdAt?: Date;
    chapters?: IChapter[];
  }
  
  export interface IChapter {
    title: string;            // Required, title of the chapter
    description?: string;     // Optional, description of the chapter
    videoUrl?: string | null; // Optional, URL of the video (if any)
    notes?: string | null;    // Optional, notes for the chapter (if any)
    duration?: number | null; // Optional, duration of the video in minutes
  }
  