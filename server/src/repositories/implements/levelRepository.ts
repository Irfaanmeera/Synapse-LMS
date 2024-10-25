// import { ILevel } from "../../interfaces/level";
// import { ILevelRepository } from "../interfaces/levelRepository.interface";
// import {Level} from '../../models/levelModel'

// export class LevelRepository implements ILevelRepository{
//  async createLevel(data: string): Promise<ILevel> {
//      const level = await Level.build({level:data})
//      return await level.save();
//  }

//  async findLevelById(levelId: string): Promise<ILevel | null> {
//      return await Level.findById(levelId)
//  }

//  async findLevelByName(level: string): Promise<ILevel | null> {
//      return await Level.findOne({level})
//  }

//  async updateLevel(levelId: string, data: string): Promise<ILevel> {
//      const existingLevel = await Level.findById(levelId)
//      existingLevel!.set(
//         {
//             level:data
//         }
//      )
//      return await existingLevel!.save()
//  }
//  async listLevel(levelId: string): Promise<ILevel> {
//     const level = await Level.findById(levelId);
//     level!.set({
//       status: true,
//     });
//     return await level!.save();
//   }
//   async unlistLevel(levelId: string): Promise<ILevel> {
//     const level = await Level.findById(levelId);
//     level!.set({
//       status: false,
//     });
//     return await level!.save();
//   }
//   async getListedLevels(): Promise<ILevel[] | null> {
//     return Level.find({ status: true });
//   }
  
//  async getAllLevels(): Promise<ILevel[] | null> {
//      return await Level.find()
//  }
// }