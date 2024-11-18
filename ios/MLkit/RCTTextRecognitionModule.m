//
//  TextRecognitionModule.m
//  rn_ml_app
//
//  Created by MacBook Pro on 18/11/2024.
//

// RCTCalendarModule.m
#import "RCTTextRecognitionModule.h"
#import <React/RCTLog.h>
@import MLKit;

@implementation RCTTextRecognitionModule

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE(TextRecognitionModule);

-(NSMutableDictionary *)getFrameDictionary:(CGRect) frame {
  NSMutableDictionary *rect = [NSMutableDictionary dictionary];
  [rect setValue:[NSNumber numberWithFloat:frame.origin.x] forKey:@"left"];
  [rect setValue:[NSNumber numberWithFloat:frame.origin.y] forKey:@"top"];
  [rect setValue:[NSNumber numberWithFloat:frame.size.width] forKey:@"width"];
  [rect setValue:[NSNumber numberWithFloat:frame.size.height] forKey:@"height"];
  return  rect;
}


RCT_EXPORT_METHOD(recognizeImage:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"recognizeImage URL : %@" , url);
  NSURL *_url =[NSURL URLWithString:url];
  NSData *imageData =[NSData dataWithContentsOfURL:_url];
  UIImage *image = [UIImage imageWithData:imageData];
  MLKVisionImage *visionImage = [[MLKVisionImage alloc] initWithImage:image];
  
  MLKTextRecognizerOptions *latinOptions = [[MLKTextRecognizerOptions alloc] init];
  MLKTextRecognizer *latinTextRecognizer = [MLKTextRecognizer textRecognizerWithOptions:latinOptions];
  
  [latinTextRecognizer processImage:visionImage
                    completion:^(MLKText *_Nullable result,
                                 NSError *_Nullable error) {
    if (error != nil || result == nil) {
      // Error handling
      reject(@"TextRecognizer_faliure", @"text recog is failed", nil);
      return;
    }
    // Recognized text
    NSMutableDictionary *response = [NSMutableDictionary dictionary];
    [response setValue:[NSNumber numberWithInt:image.size.width]  forKey:@"width"];
    [response setValue:[NSNumber numberWithInt:image.size.height]  forKey:@"height"];
    NSMutableArray *blocks = [NSMutableArray array];
    
//    NSString *resultText = result.text;
    for (MLKTextBlock *block in result.blocks) {
       NSMutableDictionary *blockDict = [NSMutableDictionary dictionary];
       [blockDict setValue:block.text forKey:@"text"];
       [blockDict setValue:[self getFrameDictionary:block.frame] forKey:@"rect"];
       
       
       NSMutableArray *lines = [NSMutableArray array];
       for (MLKTextLine *line in block.lines) {
         NSMutableDictionary *lineDict = [NSMutableDictionary dictionary];
         [lineDict setValue:line.text forKey:@"text"];
         [lineDict setValue:[self getFrameDictionary:line.frame] forKey:@"rect"];
        
         [lines addObject:lineDict];
       }
       [blockDict setValue:lines forKey:@"lines"];
       [blocks addObject:blockDict];
     }
    [response setValue:blocks forKey:@"blocks"];
    resolve(response);
  }];
  
}

@end

