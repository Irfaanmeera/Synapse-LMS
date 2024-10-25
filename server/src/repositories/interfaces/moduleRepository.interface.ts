import { IModule,IChapter} from "../../interfaces/module";

export interface IModuleRepository {
    createModule(moduleDetails: IModule): Promise<IModule>;
    updateModule(moduleDetails: IModule): Promise<IModule>;
    findModuleById(moduleId: string): Promise<IModule | null>;
    addChapter(moduleId: string, chapter: IChapter): Promise<IModule>;
}