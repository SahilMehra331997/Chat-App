import { UserProfile } from "./user-profile";

export interface Chat {
    id:string,
    lastMessage?:string,
    lastMessageDate?:Date,
    userIds:string[],
    users:UserProfile[],
    chatPic?:string,
    chatName?:string
}

export interface messages{
    text:string;
    senderId:string;
    sentDate:Date;
}