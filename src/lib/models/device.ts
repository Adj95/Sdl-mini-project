import { ObjectId } from 'mongodb';

export interface Device {
  _id?: ObjectId;
  name: string;
  type: string;
  status: {
    isOn: boolean;
    [key: string]: any;
  };
  powerRating?: number;
}
