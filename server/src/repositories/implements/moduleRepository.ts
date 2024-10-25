import { IModule, IChapter } from "../../interfaces/module";
import { IModuleRepository } from "../interfaces/moduleRepository.interface";
import { Module } from "../../models/moduleModel";

export class ModuleRepository implements IModuleRepository {
    async createModule(moduleDetails: IModule): Promise<IModule> {
        const module = Module.build(moduleDetails)
        return await module.save()
    }
    async findModuleById(moduleId: string): Promise<IModule | null> {
        return await Module.findById(moduleId)
    }
    async updateModule(moduleDetails: IModule): Promise<IModule> {
        const { id, name, description, module } = moduleDetails;
        const existingModule = await Module.findById(id);
        existingModule!.set(
            {
                id,
                name,
                description,
                module
            }
        )
        return await existingModule!.save()
    }

    async addChapter(moduleId: string, chapter: IChapter): Promise<IModule> {
        const module = await Module.findById(moduleId)
        module?.chapters?.push(chapter)
        return await module!.save()
    }
}
