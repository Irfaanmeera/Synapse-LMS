import { IChapter, IModule } from "../../interfaces/module";
import { IModuleRepository } from "../interfaces/moduleRepository.interface";
import { Module } from "../../models/moduleModel";


export class ModuleRepository implements IModuleRepository {
    async createModule(moduleDetails: IModule): Promise<IModule> {
        const module = Module.build(moduleDetails);
        return await module.save();
      }

  async updateModule(moduleId: string, updateData: Partial<IModule>): Promise<IModule | null> {
      return await Module.findByIdAndUpdate(moduleId, updateData, { new: true });
  }

  async deleteModule(moduleId: string): Promise<IModule | null> {
      return await Module.findByIdAndDelete(moduleId);
  }

  async addChapter(moduleId: string, chapter: IChapter): Promise<IModule> {
    const module = await Module.findById(moduleId);
    module?.chapters?.push(chapter);
    return await module!.save();
  }




  async findModuleById(moduleId: string): Promise<IModule | null> {
      return await Module.findById(moduleId);
  }
}

