import { LightningElement,api,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getFileList from '@salesforce/apex/AttachedFileViewerApexController.getFileList';

export default class AttachedFileViewer extends LightningElement {
  @api recordId;
  @api heightIframe;

  wiredFileList;
  files;

  @wire(getFileList, { recordId: '$recordId' })
  wiredGetFileList(value){
    this.wiredFileList = value;

    const {data, error} = value;    
    if(data){
      let a = JSON.parse(data);
      for(let i = 0; i < a.length; i++){

        // Default values
        a[i]['isPdf'] = false;
        a[i]['isImage'] = false;
        a[i]['isMovie'] = false;
        a[i]['isOther'] = true;
        a[i]['iconname'] = 'doctype:unknown';
        a[i]['srcurl'] = '/sfc/servlet.shepherd/document/download/' + a[i].ContentDocumentId;
        a[i]['previewurl'] = '/sfc/servlet.shepherd/version/renditionDownload?rendition=SVGZ&versionId=' + a[i].Id;
        if(a[i]['Title'].length > 18) a[i]['Title'] = a[i]['Title'].substr(0,15) + '...';

        if(a[i].FileType === 'PDF'){
          a[i]['isPdf'] = true;
          a[i]['isOther'] = false;
          a[i]['iconname'] = 'doctype:pdf';
        }else if(a[i].FileType === 'JPG' || a[i].FileType === 'PNG' || a[i].FileType === 'GIF'){
          a[i]['isImage'] = true;
          a[i]['isOther'] = false;
          a[i]['iconname'] = 'doctype:image';
        }else if(a[i].FileType === 'WORD' || a[i].FileType === 'WORD_X'){
          a[i]['iconname'] = 'doctype:word';
        }else if(a[i].FileType === 'EXCEL' || a[i].FileType === 'EXCEL_X'){
          a[i]['iconname'] = 'doctype:excel';
        }else if(a[i].FileType === 'POWER_POINT' || a[i].FileType === 'POWER_POINT_X'){
          a[i]['iconname'] = 'doctype:ppt';
        }else if(a[i].FileType === 'MOV' || a[i].FileType === 'MP4'){
          a[i]['isMovie'] = true;
          a[i]['isOther'] = false;
          a[i]['iconname'] = 'doctype:video';
        }

      }

      this.files = a;
      //window.console.log(this.files);

    }else if(error){
      window.console.log('[DEBUG] wiredFiles error.');
    }
  };

  handleClickReload(){
    return refreshApex(this.wiredFileList);
  }
}