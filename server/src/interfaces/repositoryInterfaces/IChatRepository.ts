import { IChat, IMessage } from "../entityInterface/IChat";

export interface IChatRepository {
  createChatRoom(chatDetails: IChat): Promise<IChat>;
  addMessage(courseId: string, message: IMessage): Promise<IChat>;
  getChatByCourseId(courseId: string): Promise<IChat | null>;
}