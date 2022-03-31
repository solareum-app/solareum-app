//
//  RNCloudFs.m
//  Solareum
//
//  Created by HuongLam on 21/03/2022.
//


#import "RNCloudFs.h"
#import <UIKit/UIKit.h>
//#import "RCTEventDispatcher.h"
//#import "RCTUtils.h"
#import <AssetsLibrary/AssetsLibrary.h>
//#import "RCTLog.h"

@implementation RNCloudFs

- (dispatch_queue_t)methodQueue
{
    return dispatch_queue_create("RNCloudFs.queue", DISPATCH_QUEUE_SERIAL);
}

RCT_EXPORT_MODULE()

//see https://developer.apple.com/library/content/documentation/General/Conceptual/iCloudDesignGuide/Chapters/iCloudFundametals.html

RCT_EXPORT_METHOD(createFile:(NSDictionary *) options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSString *destinationPath = [options objectForKey:@"targetPath"];
    NSString *content = [options objectForKey:@"content"];
    NSString *scope = [options objectForKey:@"scope"];
    bool documentsFolder = !scope || [scope caseInsensitiveCompare:@"visible"] == NSOrderedSame;
    
    NSString *tempFile = [NSTemporaryDirectory() stringByAppendingPathComponent:[[NSUUID UUID] UUIDString]];
    
    NSError *error;
    [content writeToFile:tempFile atomically:YES encoding:NSUTF8StringEncoding error:&error];
    if(error) {
        return reject(@"error", error.description, nil);
    }
    
    [self moveToICloudDirectory:documentsFolder :tempFile :destinationPath :resolve :reject];
}

RCT_EXPORT_METHOD(fileExists:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSString *destinationPath = [options objectForKey:@"targetPath"];
    NSString *scope = [options objectForKey:@"scope"];
    bool documentsFolder = !scope || [scope caseInsensitiveCompare:@"visible"] == NSOrderedSame;
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    NSURL *ubiquityURL = documentsFolder ? [self icloudDocumentsDirectory] : [self icloudDirectory];
    
    if (ubiquityURL) {
        NSURL* dir = [ubiquityURL URLByAppendingPathComponent:destinationPath];
        NSString* dirPath = [dir.path stringByStandardizingPath];
        
        bool exists = [fileManager fileExistsAtPath:dirPath];
        
        return resolve(@(exists));
    } else {
        NSLog(@"Could not retrieve a ubiquityURL");
        return reject(@"error", [NSString stringWithFormat:@"could access iCloud drive '%@'", destinationPath], nil);
    }
}

RCT_EXPORT_METHOD(listFiles:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSString *destinationPath = [options objectForKey:@"targetPath"];
    NSString *scope = [options objectForKey:@"scope"];
    bool documentsFolder = !scope || [scope caseInsensitiveCompare:@"visible"] == NSOrderedSame;
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZ"];
    
    NSURL *ubiquityURL = documentsFolder ? [self icloudDocumentsDirectory] : [self icloudDirectory];
    
    if (ubiquityURL) {
        NSURL* target = [ubiquityURL URLByAppendingPathComponent:destinationPath];
        
        NSMutableArray<NSDictionary *> *fileData = [NSMutableArray new];
        
        NSError *error = nil;
        
        BOOL isDirectory;
        [fileManager fileExistsAtPath:[target path] isDirectory:&isDirectory];

        NSURL *dirPath;
        NSArray *contents;
        if(isDirectory) {
            contents = [fileManager contentsOfDirectoryAtPath:[target path] error:&error];
            dirPath = target;
        } else {
            contents = @[[target lastPathComponent]];
            dirPath = [target URLByDeletingLastPathComponent];
        }

        if(error) {
            return reject(@"error", error.description, nil);
        }

        [contents enumerateObjectsUsingBlock:^(id object, NSUInteger idx, BOOL *stop) {
            NSURL *fileUrl = [dirPath URLByAppendingPathComponent:object];
            
            NSError *error;
            NSDictionary *attributes = [fileManager attributesOfItemAtPath:[fileUrl path] error:&error];
            if(error) {
              NSLog(@"problem getting attributes for %@", [fileUrl path]);
                //skip this one
                return;
            }
            
            NSFileAttributeType type = [attributes objectForKey:NSFileType];
            
            bool isDir = type == NSFileTypeDirectory;
            bool isFile = type == NSFileTypeRegular;
            
            if(!isDir && !isFile)
                return;
            
            NSDate* modDate = [attributes objectForKey:NSFileModificationDate];

            NSURL *shareUrl = [fileManager URLForPublishingUbiquitousItemAtURL:fileUrl expirationDate:nil error:&error];
            
            [fileData addObject:@{
                                  @"name": object,
                                  @"path": [fileUrl path],
                                  @"uri": shareUrl ? [shareUrl absoluteString] : [NSNull null],
                                  @"size": [attributes objectForKey:NSFileSize],
                                  @"lastModified": [dateFormatter stringFromDate:modDate],
                                  @"isDirectory": @(isDir),
                                  @"isFile": @(isFile)
                                  }];
        }];
        
        if (error) {
            return reject(@"error", [NSString stringWithFormat:@"could not copy to iCloud drive '%@'", destinationPath], error);
        }
        
        NSString *relativePath = [[dirPath path] stringByReplacingOccurrencesOfString:[ubiquityURL path] withString:@"."];
        
        return resolve(@{
                         @"files": fileData,
                         @"path": relativePath
                         });
        
    } else {
        NSLog(@"Could not retrieve a ubiquityURL");
        return reject(@"error", [NSString stringWithFormat:@"could not copy to iCloud drive '%@'", destinationPath], nil);
    }
}

RCT_EXPORT_METHOD(copyToCloud:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    // mimeType is ignored for iOS
    NSDictionary *source = [options objectForKey:@"sourcePath"];
    NSString *destinationPath = [options objectForKey:@"targetPath"];
    NSString *scope = [options objectForKey:@"scope"];
    bool documentsFolder = !scope || [scope caseInsensitiveCompare:@"visible"] == NSOrderedSame;
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    NSString *sourceUri = [source objectForKey:@"uri"];
    if(!sourceUri) {
        sourceUri = [source objectForKey:@"path"];
    }
    
    if([sourceUri hasPrefix:@"assets-library"]){
        ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];
        
        [library assetForURL:[NSURL URLWithString:sourceUri] resultBlock:^(ALAsset *asset) {
            
            ALAssetRepresentation *rep = [asset defaultRepresentation];
            
            Byte *buffer = (Byte*)malloc(rep.size);
            NSUInteger buffered = [rep getBytes:buffer fromOffset:0.0 length:rep.size error:nil];
            NSData *data = [NSData dataWithBytesNoCopy:buffer length:buffered freeWhenDone:YES];
            
            if (data) {
                NSString *filename = [sourceUri lastPathComponent];
                NSString *tempFile = [NSTemporaryDirectory() stringByAppendingPathComponent:filename];
                [data writeToFile:tempFile atomically:YES];
                [self moveToICloudDirectory:documentsFolder :tempFile :destinationPath :resolve :reject];
            } else {
              NSLog(@"source file does not exist %@", sourceUri);
                return reject(@"error", [NSString stringWithFormat:@"failed to copy asset '%@'", sourceUri], nil);
            }
        } failureBlock:^(NSError *error) {
          NSLog(@"source file does not exist %@", sourceUri);
            return reject(@"error", error.description, nil);
        }];
    } else if ([sourceUri hasPrefix:@"file:/"] || [sourceUri hasPrefix:@"/"]) {
        NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@"^file:/+" options:NSRegularExpressionCaseInsensitive error:nil];
        NSString *modifiedSourceUri = [regex stringByReplacingMatchesInString:sourceUri options:0 range:NSMakeRange(0, [sourceUri length]) withTemplate:@"/"];
        
        if ([fileManager fileExistsAtPath:modifiedSourceUri isDirectory:nil]) {
            NSURL *sourceURL = [NSURL fileURLWithPath:modifiedSourceUri];
            
            // todo: figure out how to *copy* to icloud drive
            // ...setUbiquitous will move the file instead of copying it, so as a work around lets copy it to a tmp file first
            NSString *filename = [sourceUri lastPathComponent];
            NSString *tempFile = [NSTemporaryDirectory() stringByAppendingPathComponent:filename];
            
            NSError *error;
            [fileManager copyItemAtPath:[sourceURL path] toPath:tempFile error:&error];
            if(error) {
                return reject(@"error", error.description, nil);
            }
            
            [self moveToICloudDirectory:documentsFolder :tempFile :destinationPath :resolve :reject];
        } else {
            NSLog(@"source file does not exist %@", sourceUri);
            return reject(@"error", [NSString stringWithFormat:@"no such file or directory, open '%@'", sourceUri], nil);
        }
    } else {
        NSURL *url = [NSURL URLWithString:sourceUri];
        NSData *urlData = [NSData dataWithContentsOfURL:url];
        
        if (urlData) {
            NSString *filename = [sourceUri lastPathComponent];
            NSString *tempFile = [NSTemporaryDirectory() stringByAppendingPathComponent:filename];
            [urlData writeToFile:tempFile atomically:YES];
            [self moveToICloudDirectory:documentsFolder :tempFile :destinationPath :resolve :reject];
        } else {
          NSLog(@"source file does not exist %@", sourceUri);
            return reject(@"error", [NSString stringWithFormat:@"cannot download '%@'", sourceUri], nil);
        }
    }
}

- (void) moveToICloudDirectory:(bool) documentsFolder :(NSString *)tempFile :(NSString *)destinationPath
                              :(RCTPromiseResolveBlock)resolver
                              :(RCTPromiseRejectBlock)rejecter {
    
    if(documentsFolder) {
        NSURL *ubiquityURL = [self icloudDocumentsDirectory];
        [self moveToICloud:ubiquityURL :tempFile :destinationPath :resolver :rejecter];
    } else {
        NSURL *ubiquityURL = [self icloudDirectory];
        [self moveToICloud:ubiquityURL :tempFile :destinationPath :resolver :rejecter];
    }
}

- (void) moveToICloud:(NSURL *)ubiquityURL :(NSString *)tempFile :(NSString *)destinationPath
                     :(RCTPromiseResolveBlock)resolver
                     :(RCTPromiseRejectBlock)rejecter {
    
    
    NSString * destPath = destinationPath;
    while ([destPath hasPrefix:@"/"]) {
        destPath = [destPath substringFromIndex:1];
    }
    
  NSLog(@"Moving file %@ to %@", tempFile, destPath);
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    if (ubiquityURL) {
        
        NSURL* targetFile = [ubiquityURL URLByAppendingPathComponent:destPath];
        NSURL *dir = [targetFile URLByDeletingLastPathComponent];
        NSString *name = [targetFile lastPathComponent];
        
        NSURL* uniqueFile = targetFile;
        
        int count = 1;
        while([fileManager fileExistsAtPath:uniqueFile.path]) {
            NSString *uniqueName = [NSString stringWithFormat:@"%i.%@", count, name];
            uniqueFile = [dir URLByAppendingPathComponent:uniqueName];
            count++;
        }
        
      NSLog(@"Target file: %@", uniqueFile.path);
        
        if (![fileManager fileExistsAtPath:dir.path]) {
            [fileManager createDirectoryAtURL:dir withIntermediateDirectories:YES attributes:nil error:nil];
        }
        
        NSError *error;
        [fileManager setUbiquitous:YES itemAtURL:[NSURL fileURLWithPath:tempFile] destinationURL:uniqueFile error:&error];
        if(error) {
            return rejecter(@"error", error.description, nil);
        }
        
        [fileManager removeItemAtPath:tempFile error:&error];
        
        return resolver(uniqueFile.path);
    } else {
        NSError *error;
        [fileManager removeItemAtPath:tempFile error:&error];
        
        return rejecter(@"error", [NSString stringWithFormat:@"could not copy '%@' to iCloud drive", tempFile], nil);
    }
}

- (NSURL *)icloudDocumentsDirectory {
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSURL *rootDirectory = [[self icloudDirectory] URLByAppendingPathComponent:@"Documents"];
    
    if (rootDirectory) {
        if (![fileManager fileExistsAtPath:rootDirectory.path isDirectory:nil]) {
          NSLog(@"Creating documents directory: %@", rootDirectory.path);
            [fileManager createDirectoryAtURL:rootDirectory withIntermediateDirectories:YES attributes:nil error:nil];
        }
    }
    
    return rootDirectory;
}

- (NSURL *)icloudDirectory {
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSURL *rootDirectory = [fileManager URLForUbiquityContainerIdentifier:nil];
    return rootDirectory;
}

- (NSURL *)localPathForResource:(NSString *)resource ofType:(NSString *)type {
    NSString *documentsDirectory = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
    NSString *resourcePath = [[documentsDirectory stringByAppendingPathComponent:resource] stringByAppendingPathExtension:type];
    return [NSURL fileURLWithPath:resourcePath];
}

#pragma mark - Add Second Lib

#pragma mark - get iCloud or local doc root
#pragma mark - remove / replace file to or from iCloud


RCT_EXPORT_METHOD(removeICloudFile:(NSString *)path :(RCTResponseSenderBlock)callback){
    [[self fileManager] setUbiquitous:NO itemAtURL:[NSURL fileURLWithPath:path] destinationURL:[NSURL fileURLWithPath:path] error:nil];
    [[self fileManager] removeItemAtPath:path error:nil];
}
RCT_EXPORT_METHOD(replaceFileToICloud:(NSString *)localPath :(RCTResponseSenderBlock)callback)
{
    NSURL *sourceURL = [NSURL fileURLWithPath:localPath];
    NSURL *destinationURL = [self getICloudDocumentURLByLocalPath:localPath];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self createDirectionOfFileURL:destinationURL];
        
        NSURL *tmpFileURL = [NSURL fileURLWithPath: [self createTempFile:sourceURL]];
        NSError *err;
        
        dispatch_sync(dispatch_get_main_queue(), ^{
            
            NSMetadataQuery *query = [self metaQueryWithPath:[destinationURL path]];
            
            //      [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidFinishGatheringNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            //        NSDictionary *res =[self uploadProgress:query type:@"finish"];
            //        callback(@[@NO, res]);
            //      }];
            [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidUpdateNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
                //        NSDictionary *res =[self uploadProgress:query type:@"finish"];
                NSDictionary *result = [[self parseMetaQueryResult:query] objectAtIndex:0];
                //        NSLog(@"replaceToICloud meta update %@",result);
                if([[result objectForKey:@"isUploaded"] boolValue]){
                    //          NSLog([result objectForKey:@"isUploaded"]);
                    callback(@[@NO, result]);
                    [query disableUpdates];
                }
                //
            }];
            [query startQuery];
        });
        if([[self fileManager] fileExistsAtPath:[destinationURL path]]){
            [[self fileManager] removeItemAtURL:destinationURL error:nil];
            
        }
        [[self fileManager] setUbiquitous:YES itemAtURL:tmpFileURL destinationURL:destinationURL error:&err];
        
        if(err){
            callback(@[[err localizedDescription]]);
        }else {
            //      callback(@[@NO, [destinationURL absoluteString]]);
        }
    });
}
- (NSArray *)parseMetaQueryResult: (NSMetadataQuery *)query {
    NSMutableArray *res = [NSMutableArray array];
    [[query results] enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        NSNumber *isDownloaded = [obj valueForAttribute:NSMetadataUbiquitousItemDownloadingStatusDownloaded];
        if(!isDownloaded)isDownloaded = [NSNumber numberWithInt:-1];
        NSNumber *isUploaded = [obj valueForAttribute:NSMetadataUbiquitousItemIsUploadedKey];
        if(!isUploaded)isUploaded = [NSNumber numberWithInt:-1];
        
        //    NSLog(@"download current key %@", NSMetadataUbiquitousItemDownloadingStatusCurrent);
        [res addObject:@{
                         @"path": [obj valueForAttribute:NSMetadataItemPathKey],
                         @"filename": [obj valueForAttribute:NSMetadataItemFSNameKey],
                         @"isUploaded": isUploaded,
                         @"isDownloaded": isDownloaded,
                         @"downloadStatus": [obj valueForAttribute:NSMetadataUbiquitousItemDownloadingStatusKey]
                         }];
    }];
    return res;
}
- (NSDictionary *)uploadProgress: (id)query type:(NSString *)type{
    NSMutableArray *arr = [NSMutableArray array];
    [[query results] enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [arr addObject:@{
                         @"path": [obj valueForAttribute:NSMetadataItemPathKey],
                         @"filename": [obj valueForAttribute:NSMetadataItemFSNameKey],
                         @"percentUploaded": [obj valueForAttribute:NSMetadataUbiquitousItemPercentUploadedKey]
                         }];
    }];
    return @{@"type":@"finish", @"result":arr};
}

RCT_EXPORT_METHOD(replaceFileFromICloud:(NSString *)iCloudPath :(RCTResponseSenderBlock)callback)
{
    //  NSURL *docUrl = [self getICloudDocumentURL];
    NSURL *sourceURL = [NSURL fileURLWithPath:iCloudPath];
    NSURL *destinationURL = [self getDocumentURLByICloudPath:iCloudPath];
    if(![[[NSFileManager alloc] init] fileExistsAtPath:iCloudPath]){
        callback(@[@"file not exists, probably not downloaded yet"]);
        return;
    }
    //  return;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [self createDirectionOfFileURL:destinationURL];
        
        [self createTempFile:sourceURL];
        NSString *tmpPath = [self createTempFile:sourceURL];
        if(!tmpPath) {
            NSString *msg =[NSString stringWithFormat:@"create tmp file fail: %@", sourceURL];
            callback(@[ msg ]);
        }else {
            NSURL *tmpFileURL = [NSURL fileURLWithPath:tmpPath];
            NSURL *resultingURL;
            NSError *err;
            //      NSLog(@"replace item to url %@", destinationURL);
            [[self fileManager] replaceItemAtURL:destinationURL withItemAtURL:tmpFileURL backupItemName:nil options:0 resultingItemURL:&resultingURL error:&err];
            //    NSURL *resultingURL = [self replaceItemFrom:tmpFileURL to:destinationURL];
            if(err){
                //        NSLog(@"replacing err %@", err);
                callback(@[[err localizedDescription]]);
                //      callback(@[@"URL unexpectly changed during replacing", [resultingURL absoluteString]]);
            }else {
                callback(@[@NO, [resultingURL absoluteString]]);
            }
        }
    });
}


#pragma mark - copy file to or from iCloud
RCT_EXPORT_METHOD(copyFileToICloud:(NSString *)localPath :(RCTResponseSenderBlock)callback)
{
    //  NSURL *docUrl = [self getICloudDocumentURL];
    NSURL *sourceURL = [NSURL fileURLWithPath:localPath];
    NSURL *destinationURL = [self getICloudDocumentURLByLocalPath:localPath];
    
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager *fileManager = [[NSFileManager alloc] init];
        [self createDirectionOfFileURL:destinationURL];
        NSError *err = nil;
        [fileManager copyItemAtURL:sourceURL toURL:destinationURL error:&err];
        
        if(err==nil) {
            callback(@[@NO, [destinationURL absoluteString]]);
        }else {
            callback(@[ [err localizedDescription] ]);
        }
    });
}
RCT_EXPORT_METHOD(copyFileFromICloud:(NSString *)path :(RCTResponseSenderBlock)callback)
{
    NSURL *destinationURL = [self getDocumentURLByICloudPath:path];
    NSURL *sourceURL = [NSURL fileURLWithPath:path];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager *fileManager = [[NSFileManager alloc] init];
        [self createDirectionOfFileURL:destinationURL];
        NSError *err = nil;
        [fileManager copyItemAtURL:sourceURL toURL:destinationURL error:&err];
        
        if(err==nil) {
            callback(@[@NO, [destinationURL absoluteString]]);
        }else {
            callback(@[ [err localizedDescription] ]);
        }
    });
}
//- (void)copyItemFrom:(NSURL *)urlFrom to:(NSURL *)urlTo error:(NSError **)error {
//  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
//    NSFileManager *fileManager = [[NSFileManager alloc] init];
//    [self createDirectionOfFileURL:urlTo];
//    [fileManager copyItemAtURL:urlFrom toURL:urlTo error:error];
//  });
//}

#pragma mark - move file to or from icloud
RCT_EXPORT_METHOD(moveFileToICloud:(NSString *)pathToUpload :(RCTResponseSenderBlock)callback)
{
    //  NSURL *docUrl = [self getICloudDocumentURL];
    
    NSURL *sourceURL = [NSURL fileURLWithPath:pathToUpload];
    NSURL *destinationURL = [self getICloudDocumentURLByLocalPath:pathToUpload];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager *fileManager = [[NSFileManager alloc] init];
        
        [self createDirectionOfFileURL:destinationURL];
        NSError *err = nil;
        BOOL success = [fileManager setUbiquitous:YES itemAtURL:sourceURL destinationURL:destinationURL error:&err];
        dispatch_async(dispatch_get_main_queue(), ^{
            if(success) {
                callback(@[@NO, [destinationURL absoluteString]]);
            }else {
                callback(@[ [err localizedDescription] ]);
            }
        });
        
    });
}
RCT_EXPORT_METHOD(moveFileFromICloud:(NSString *)iCloudPath :(RCTResponseSenderBlock)callback)
{
    //  NSURL *docUrl = [self getICloudDocumentURL];
    
    NSURL *sourceURL = [NSURL fileURLWithPath:iCloudPath];
    NSURL *destinationURL = [self getDocumentURLByICloudPath:iCloudPath];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager *fileManager = [[NSFileManager alloc] init];
        
        [self createDirectionOfFileURL:destinationURL];
        NSError *err = nil;
        BOOL success = [fileManager setUbiquitous:NO itemAtURL:sourceURL destinationURL:destinationURL error:&err];
        dispatch_async(dispatch_get_main_queue(), ^{
            if(success) {
                callback(@[@NO, [destinationURL absoluteString]]);
            }else {
                callback(@[ [err localizedDescription] ]);
            }
        });
        
    });
}

- (NSFileManager *)fileManager {
    return [[NSFileManager alloc] init];
}
- (NSString *)encodePath: (NSString*)path {
    return [path stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
}
# pragma mark - downloadUbiquitousPath
RCT_EXPORT_METHOD(downloadUbiquitousPath:(NSString *)path :(RCTResponseSenderBlock)callback){
    
    dispatch_sync(dispatch_get_main_queue(), ^{
        
        NSMetadataQuery *query = [self metaQueryWithPath:path];
        //    NSLog(@"try get download update status %@", path);
        
        [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidUpdateNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            [[query results] enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSString *filename =[obj valueForAttribute:NSMetadataItemFSNameKey];
                if (![[path lastPathComponent] isEqualToString:filename]) { return; }
                
                NSDictionary *res = [[self parseMetaQueryResult:query] objectAtIndex:idx];
                if([res valueForKey:@"isDownloaded"]){
                    callback(@[ @NO, res ]); [query disableUpdates];
                }
                //      NSDictionary *result = [[self parseMetaQueryResult:query] objectAtIndex:0];
                //      NSLog(@"download update %@", result);
                
            }];
        }];
        
        
        [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidFinishGatheringNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            [[query results] enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                
                NSString *filename =[obj valueForAttribute:NSMetadataItemFSNameKey];
                if (![[path lastPathComponent] isEqualToString:filename]) {
                    NSLog(@"path not same %@, %@" ,[path lastPathComponent], filename);
                    return; }
                //        NSDictionary *obj = [[query results] objectAtIndex:0];
                if ([[obj valueForKey:NSMetadataUbiquitousItemDownloadingStatusKey]
                     isEqualToString:NSMetadataUbiquitousItemDownloadingStatusCurrent]) { //file is updated
                    NSDictionary *res = [[self parseMetaQueryResult:query] objectAtIndex:idx];
                    callback(@[@NO, res ]); [query disableUpdates];
                }
                
            }];
            
        }];
        
        NSError *err;
        [[[NSFileManager alloc] init] startDownloadingUbiquitousItemAtURL:[NSURL fileURLWithPath:path] error:&err];
        [query startQuery];
        NSLog(@"something");
        if(err){
            NSLog(@"download err %@",err);
            callback(@[[err localizedDescription]]);
        }
        
    });
}

- (NSMetadataQuery *)metaQueryWithPath: (NSString *)path {
    
    NSMetadataQuery *query = [[NSMetadataQuery alloc] init];
    [query setSearchScopes:@[NSMetadataQueryUbiquitousDocumentsScope]];
    [query setPredicate:[NSPredicate predicateWithFormat:@"%K BEGINSWITH %@", NSMetadataItemPathKey, path]];
    return query;
}

#pragma mark - itemAttrsOfDirectoryAtICloud
RCT_EXPORT_METHOD(itemAttrsOfDirectoryAtICloud:(NSString *)path :(RCTResponseSenderBlock)callback){
    
    dispatch_sync(dispatch_get_main_queue(), ^{
        NSLog(@"try get attrs of icloud %@", path);
        NSMetadataQuery *query = [self metaQueryWithPath:path];
        //    query.delegate = self;
        //    query = [[NSMetadataQuery alloc] init];
        //      [query setSearchScopes:@[NSMetadataQueryUbiquitousDocumentsScope]];
        //    [query setPredicate:[NSPredicate predicateWithFormat:@"%K BEGINSWITH %@", NSMetadataItemPathKey, path]];
        //
        
        [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidUpdateNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            NSLog(@"attrs of icloud %@", [self parseMetaQueryResult:query]);
            //      NSArray *res = [self queryDidFinishGathering:query];
            //      callback(@[@NO, res]);
        }];
        [[NSNotificationCenter defaultCenter] addObserverForName:NSMetadataQueryDidFinishGatheringNotification object:query queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            NSArray *res = [self queryDidFinishGathering:query];
            callback(@[@NO, res]);
        }];
        [query startQuery];
    });
    
}

//@synthesize query;

- (NSArray *)queryDidFinishGathering:(NSMetadataQuery *)query {
    NSMutableArray *res = [NSMutableArray array];
    [query enumerateResultsUsingBlock:^(id  _Nonnull result, NSUInteger idx, BOOL * _Nonnull stop) {
        NSNumber *createAt = [self getDateNumber:[result valueForAttribute:NSMetadataItemFSCreationDateKey]];
        NSNumber *modifyAt = [self getDateNumber:[result valueForAttribute:NSMetadataItemFSContentChangeDateKey]];
        NSNumber *size = [result valueForAttribute:NSMetadataItemFSSizeKey];
        if(!size) size = [NSNumber numberWithInt:-1];
        NSString *path = [result valueForAttribute:NSMetadataItemPathKey];
        NSNumber *exists = [NSNumber numberWithBool:[[[NSFileManager alloc] init] fileExistsAtPath:path]] ;
        
        NSDictionary *item = @{
                               @"path": path,
                               @"name": [result valueForAttribute:NSMetadataItemFSNameKey],
                               @"createAt": createAt,
                               @"modifyAt": modifyAt,
                               @"size": size,
                               @"downloaded": exists
                               //                           @"downloaded": [result valueForAttribute:NSMetadataUbiquitousItemPercentDownloadedKey]
                               };
        [res addObject:item];
        //    NSLog(@"meta item %@", result);
    }];
    return res;
    //  [[query results] enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    //
    //  }];
    //  NSLog(@"did finish observe %@", res);
    
    //  [query disableUpdates];
    //  [query stopQuery];
    
}

#pragma mark - get file attributes with path
RCT_EXPORT_METHOD(attributesOfItemAtPath:(NSString *)path :(RCTResponseSenderBlock)callback){
    NSFileManager *fileManager = [[NSFileManager alloc] init];
    NSDictionary *attrs;
    BOOL isDir;
    BOOL isExists = [fileManager fileExistsAtPath:path isDirectory:&isDir];
    if (!isExists) {
        callback(@[@"path not exists"]);
        return;
    }else if(isDir){
        attrs = [fileManager attributesOfItemAtPath:path error:nil];
    }else {
        attrs = [fileManager attributesOfItemAtPath:path error:nil];
    }
    
    //  NSNumber *createAt = [NSNumber numberWithDouble: [[attrs objectForKey:@"NSFileCreationDate"] timeIntervalSince1970] ];
    NSNumber *createAt = [self getDateNumber:[attrs objectForKey:@"NSFileCreationDate"]];
    //  NSNumber *modifyAt = [NSNumber numberWithDouble: [[attrs objectForKey:@"NSFileModificationDate"] timeIntervalSince1970] ];
    NSNumber *modifyAt = [self getDateNumber:[attrs objectForKey:@"NSFileModificationDate"]];
    //  NSLog(@"attrs %@ at %@", attrs, path);
    NSMutableDictionary *ret = [NSMutableDictionary dictionaryWithDictionary: @{
                                                                                @"path": path,
                                                                                @"createAt": createAt,
                                                                                @"modifyAt": modifyAt,
                                                                                @"isDirectory": [NSNumber numberWithBool:isDir]
                                                                                }];
    if(!isDir) {
        [ret setValue:[attrs objectForKey:@"NSFileSize"] forKey:@"size"];
    }
    //  NSLog(@"attrs %@", attrs);
    callback(@[@NO, ret]);
}
- (NSNumber *)getDateNumber: (id)obj{
    return [NSNumber numberWithDouble: [ obj timeIntervalSince1970] ];
}

#pragma mark - contents at item or directory
RCT_EXPORT_METHOD(contentsAtPath:(NSString *)path :(RCTResponseSenderBlock)callback){
    NSFileManager *fileManager = [[NSFileManager alloc] init];
    
    NSData *data = [fileManager contentsAtPath:path];
    NSString *dataStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    //  NSLog(@"datastr %@", dataStr);
    callback(@[@NO, dataStr]);
}
RCT_EXPORT_METHOD(contentsOfDirectoryAtPath:(NSString *)path :(RCTResponseSenderBlock)callback){
    NSFileManager *fileManager = [[NSFileManager alloc] init];
    NSError *err;
    NSArray *array = [fileManager contentsOfDirectoryAtPath:path error:&err];
    //  NSLog(@"contentsOfDirectoryAtPath err %@", [err description]);
    if(err){
        callback(@[[err localizedDescription]]);
    }else {
        callback(@[@NO, array]);
    }
}

#pragma mark - remove file with path
RCT_EXPORT_METHOD(removeFileAtPath:(NSString *)pathToRemove :(RCTResponseSenderBlock)callback){
    NSURL *destinationURL = [NSURL URLWithString:pathToRemove];
    
    NSFileManager *fileManager = [[NSFileManager alloc] init];
    BOOL fileExists = [fileManager fileExistsAtPath:pathToRemove];
    if(!fileExists){
        callback(@[@"file not exists"]);
        return;
    }
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSError *error = nil;
        NSFileCoordinator *fileCoordinator = [[NSFileCoordinator alloc] initWithFilePresenter:nil];
        [fileCoordinator coordinateWritingItemAtURL:destinationURL options:NSFileCoordinatorWritingForDeleting error:&error byAccessor:^(NSURL * _Nonnull newURL) {
            NSError *err = nil;
            [fileManager removeItemAtURL:destinationURL error:&err];
            if (err) {
                callback(@[ [err localizedDescription] ]);
            }else {
                callback(@[ @FALSE, @TRUE ]);
            }
        }];
    });
    
}

#pragma mark - get iCloud token
RCT_EXPORT_METHOD(getICloudToken:(RCTResponseSenderBlock)callback){
    id token = [[[NSFileManager alloc] init] ubiquityIdentityToken];
    //  DumpObjcMethods(object_getClass(token));
    //  NSLog(@"token %@", token);
    if (token == nil) {
        callback(@[@"Token Nil", [NSNull null]]);
    }else {
        
        NSData *tokenData = [NSKeyedArchiver archivedDataWithRootObject:token];
        NSLog(@"parsed token NSData %@", tokenData);
        //    NSString *tokenDataString = [[NSString alloc] initWithData:tokenData encoding:NSUTF8StringEncoding];
        NSString *tokenDataString = [tokenData description];
        NSLog(@"try parse data to string %@", tokenDataString);
        callback(@[@NO, tokenDataString]);
        //    NSData *tokenData = [token serializedRepresentation];
        //    NSString *tokenStr = [[NSString alloc] initWithData:tokenData encoding:NSUTF8StringEncoding];
        //    callback(@[tokenStr]);
    }
}


#pragma mark - get iCloud or local doc root
RCT_EXPORT_METHOD(iCloudDocumentPath:(RCTResponseSenderBlock)callback)
{
    callback(@[@NO, [[self getICloudDocumentURL] path] ]);
}
RCT_EXPORT_METHOD(documentPath:(RCTResponseSenderBlock)callback)
{
    callback(@[@NO,  [self _documentPath] ]);
}
RCT_EXPORT_METHOD(getICloudDocumentURLByLocalPath:(NSString *)localPath :(RCTResponseSenderBlock)callback){
    NSURL *url = [self getICloudDocumentURLByLocalPath:localPath];
    callback(@[@NO,  [url absoluteString] ]);
}


#pragma mark - native methods
- (NSString *)createTempFile:(NSURL *)url {
    NSFileManager *fileManager = [[NSFileManager alloc] init];
    //  NSLog(@"create tmp file %@, %i", url, [fileManager fileExistsAtPath:[url path]]);
    if(![fileManager fileExistsAtPath:[url path]]){
        NSLog(@"create tmp fail, source file not exists: %@", url);
        return nil;
    }
    NSString *filename = [url lastPathComponent];
    NSString *tempPath = [NSTemporaryDirectory() stringByAppendingPathComponent:filename];
    [fileManager createDirectoryAtPath:tempPath withIntermediateDirectories:YES attributes:nil error:nil];
    
    if ( [fileManager fileExistsAtPath:tempPath] ) {
        //    NSLog(@"remove existed: %@", tempPath);
        NSError *removeErr;
        [fileManager removeItemAtPath:tempPath error:&removeErr];
        if (removeErr) {
            NSLog(@"remove item err %@", [removeErr localizedDescription]);
        }
    }
    
    NSError *err;
    BOOL tempCopied = [[self fileManager] copyItemAtPath:[url path] toPath:tempPath error:&err];
    if(err)NSLog(@"create tmp err,%@, %@", tempPath, err);
    if (tempCopied) {
        return tempPath;
    }else {
        return nil;
    }
    //  return tempCopied;
}
- (void)createDirectionOfFileURL:(NSURL *)url {
    NSURL *dir = [url URLByDeletingLastPathComponent];
    [[[NSFileManager alloc] init] createDirectoryAtURL:dir withIntermediateDirectories:YES attributes:nil error:nil];
}

- (NSString *)_documentPath {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    return [paths objectAtIndex:0];
}
- (NSString*)getRelativePath:(NSString *)path {
    //  NSString *docPath = [self _documentPath];
    NSRange range = [path rangeOfString:@"/Documents/"];
    NSString *relativePath = [path substringFromIndex:range.location+range.length];
    //  NSLog(@"relative path input:%@ out:%@", path, relativePath);
    return relativePath;
}
- (NSURL *)getDocumentURLByICloudPath: (NSString *)iCloudPath {
    //  NSLog(@"rctmd5 of diary-item-2015-10-29, %@",RCTMD5Hash(@"diary-item-2015-10-29"));
    //  NSString *relativePath = [self getRelativePath:iCloudPath];
    //  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    //  NSString *icloudID = [NSString stringWithFormat:@"iCloud.%@", bundleIdentifier];
    NSString *basePath = [[self getICloudDocumentURL] path];
    NSRange range = [iCloudPath rangeOfString:basePath];
    NSString *relativePath = [iCloudPath substringFromIndex:range.location+range.length+1];
    //  NSLog(@"icloud basePath %@, relative: %@", basePath, relativePath);
    
    
    NSURL *localURL = [[NSURL fileURLWithPath:[self _documentPath]] URLByAppendingPathComponent:relativePath];
    //  NSLog(@"getDocumentURLByICloudPath \nrelative:%@\n\nsource:\n%@\n\ndest:\n%@ \n\n\n", relativePath, iCloudPath, localURL);
    return localURL;
}
- (NSURL *)getICloudDocumentURLByLocalPath: (NSString *)localPath {
    NSURL *docUrl = [self getICloudDocumentURL];
    //  localPath = [self getRelativePathOfDocuments:localPath];
    //  NSString *filename = [localPath lastPathComponent];
    NSString *filename = [self getRelativePath:localPath];
    NSURL *destinationURL = [docUrl URLByAppendingPathComponent:filename];
    return destinationURL;
}
- (NSURL *)getICloudDocumentURL {
    // get icloud docURL with default bundleID
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    NSString *icloudID = [NSString stringWithFormat:@"iCloud.%@", bundleIdentifier];
    //  [NSFileManager URLForUbiquityContainerIdentifier:nil].path
    NSURL *containerURL = [[NSFileManager defaultManager] URLForUbiquityContainerIdentifier:icloudID];
    //  NSURL *containerURL = [[NSFileManager defaultManager] URLForUbiquityContainerIdentifier:nil];
    NSURL *docUrl = [containerURL URLByAppendingPathComponent:@"Documents"];
    return docUrl;
}

@end
