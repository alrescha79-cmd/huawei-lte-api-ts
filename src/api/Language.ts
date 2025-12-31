import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType, SetResponseType } from '../types';


export class Language extends ApiGroup {
    setCurrentLanguage(current_language: string): Promise<SetResponseType> {
        return this.postSet('language/current-language', {
            'CurrentLanguage': current_language
        });
    }

    currentLanguage(): Promise<GetResponseType> {
        return this.get('language/current-language');
    }
}