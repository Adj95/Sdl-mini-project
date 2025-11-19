import { ObjectId } from 'mongodb';

export interface AutomationRule {
  _id?: ObjectId;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}
