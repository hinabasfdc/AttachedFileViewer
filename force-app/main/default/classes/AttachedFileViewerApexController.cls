public with sharing class AttachedFileViewerApexController {

    private static final List<String> FILETYPES = new List<String>{'JPG','JPEG','PNG','GIF','PDF','WORD','EXCEL','WORD_X','EXCEL_X','POWER_POINT','POWER_POINT_X','MOV','MP4'};

    @AuraEnabled(cacheable=true)
    public static string getFileList(String recordId){
        if(String.isBlank(recordId)) return null;
        String retval = '';
        List<ContentDocumentLink> cdls = [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId AND isDeleted = false];
        if(cdls.size() > 0){
            List<String> ids = new List<String>();
            for(Integer i = 0; i < cdls.size(); i++){
                ids.add(cdls[i].ContentDocumentId);
            }
            List<ContentVersion> cvs = [SELECT Id, ContentDocumentId, Title, FileType, PathOnClient, ContentSize FROM ContentVersion WHERE IsLatest = true AND ContentDocumentId IN :ids AND FileType IN :FILETYPES];
            if(cvs.size() > 0){
                retval = System.JSON.serialize(cvs);
            }
        }
        return retval;
    }
}
