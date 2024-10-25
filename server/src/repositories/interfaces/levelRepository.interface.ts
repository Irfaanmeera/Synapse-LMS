import { ILevel } from "../../interfaces/level";

export interface ILevelRepository {
  createLevel(level: string): Promise<ILevel>;
  findLevelByName(level: string): Promise<ILevel | null>;
  findLevelById(levelId: string): Promise<ILevel | null>;
  updateLevel(levelId: string, data: string): Promise<ILevel>;
  getAllLevels():Promise<ILevel[]|null>
  listLevel(levelId: string): Promise<ILevel>;
  unlistLevel(levelId: string): Promise<ILevel>;
  getListedLevels(): Promise<ILevel[] | null>;
}