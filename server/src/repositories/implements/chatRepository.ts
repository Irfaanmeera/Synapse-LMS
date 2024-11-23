import { IChatRepository } from "../interfaces/chatRepository.interface";
import { IChat, IMessage } from "../../interfaces/chat";
import { Chat } from "../../models/chatModel";
import { BadRequestError } from "../../constants/errors/badrequestError";

export class ChatRepository implements IChatRepository {
  async createChatRoom(chatDetails: IChat): Promise<IChat> {
    const chatroom = Chat.build(chatDetails);
    console.log("chatroom created")
    return await chatroom.save();
  }

  async getChatByCourseId(courseId: string): Promise<IChat | null> {
    const chat=  await Chat.findOne({ courseId });
    console.log("Chat in repository", chat)
    return chat;
  }

  async addMessage(courseId: string, message: IMessage): Promise<IChat> {
    const chat = await Chat.findOne({ courseId });
    if (!chat) {
      throw new BadRequestError("Chat not found");
    }
    chat.messages?.push(message);
    console.log("Chat:", chat)
    return await chat.save();
  }
}