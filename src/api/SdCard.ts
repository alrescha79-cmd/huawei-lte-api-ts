import { ApiGroup } from '../base/ApiGroup';
import { GetResponseType, SetResponseType } from '../types';


export class SdCard extends ApiGroup {
    dlnaSetting(): Promise<GetResponseType> {
        return this.get('sdcard/dlna-setting');
    }

    setDlnaSetting(enabled: boolean, shareAll: boolean,
                         sharePath: string = '/'): Promise<SetResponseType> {
        return this.postSet('sdcard/dlna-setting', {
            'enabled': enabled ? 1 : 0,
            'sharepath': sharePath,
            'shareallpath': shareAll  ? 1 : 0,
        });
                         }

    sdcard(): Promise<GetResponseType> {
        return this.get('sdcard/sdcard');
    }

    sdcardsamba(): Promise<GetResponseType> {
        return this.get('sdcard/sdcardsamba');
    }

    setSdcardsamba(enabled: boolean,
                        serverName: string = 'homerouter.cpe',
                        serverDescription: string = 'samba server',
                        workgroupName: string = 'WORKGROUP',
                        anonymousAccess: boolean = false,
                        printerEnabled: boolean = true): Promise<SetResponseType> {
        return this.postSet('sdcard/sdcardsamba', {
            'enabled': enabled ? 1 : 0,
            'servername': serverName,
            'serverdescription': serverDescription,
            'workgroupname': workgroupName,
            'anonymousaccess': anonymousAccess ? 1 : 0,
            'printerenable': printerEnabled ? 1 : 0,
        });
    }

    printerlist(): Promise<GetResponseType> {
        return this.get('sdcard/printerlist');
    }

    shareAccount(): Promise<GetResponseType> {
        return this.get('sdcard/share-account');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    sdfile(): Promise<GetResponseType> {
        return this.get('sdcard/sdfile');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    fileupload(): Promise<GetResponseType> {
        return this.get('sdcard/fileupload');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    checkFileExist(): Promise<GetResponseType> {
        return this.get('sdcard/Check_file_exist');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    createdir(): Promise<GetResponseType> {
        return this.get('sdcard/createdir');
    }

    /**
     * Endpoint found by reverse engineering B310s-22 firmware, unknown usage
     */
    deletefile(): Promise<GetResponseType> {
        return this.get('sdcard/deletefile');
    }
}

    
