import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType } from '../types';


export class Global extends ApiGroup {
   languagelist(): Promise<GetResponseType> {
      return this.get('global/languagelist.xml', {}, 'config');
   }

   config(): Promise<GetResponseType> {
      return this.get('global/config.xml', {}, 'config');
   }

   netType(): Promise<GetResponseType> {
      return this.get('global/net-type.xml', {}, 'config');
   }
}