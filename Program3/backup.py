# Eric Feldman
# CSS 436 - Cloud Computing
# Program 3 - Backup
# October 24, 2019
import boto3
from botocore.errorfactory import ClientError
import os
import time

#globals
mem = {}
initializeMetadata = False

# this section opens key_file.txt and reads in the keys and bucket name of s3
f = open("./key_file.txt", "r")
AWS_ACCESS_KEY_ID = f.readline().splitlines()[0]
AWS_SECRET_ACCESS_KEY = f.readline().splitlines()[0]
BUCKET_NAME = f.readline().splitlines()[0]

# creating a global client to access s3 service
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

# helper method handels new and existing directories. It parses the path names and makes calls to AWS S3
# using boto3. In addition, files are checked if there have been modifactions to them, and only pushes
# files to AWS S3 if changes have been made to reduce data bandwidth.
def upload(fileName, s3folder, name):
    """Accepts a string filename/path and will upload it to S3 """
    global mem, initializeMetadata
    extension = fileName[fileName.find("."):len(fileName)]
    if initializeMetadata == True:
        s3.upload_file(fileName, BUCKET_NAME, s3folder + "/" + name)
        mem[s3folder + "/" + name] = os.path.getmtime(fileName)
        print("Adding new directory file to aws storage system... please wait")
    if initializeMetadata == False:
        key = mem.get(s3folder + "/" + name)
        if key != None:
            print("This file already exists.. checking last modification time..")
            if os.path.getmtime(fileName) != key:
                print("Out of sync! need to update this file!")
                s3.upload_file(fileName, BUCKET_NAME, s3folder + "/" + name)
                mem[s3folder + "/" + name] = os.path.getmtime(fileName)
        if key == None:
            print("This file does not yet exist.. uploading updating metadata")
            s3.upload_file(fileName, BUCKET_NAME, s3folder + "/" + name)
            mem[s3folder + "/" + name] = os.path.getmtime(fileName)
    return name

# If any file needs to be downloaded it can be done using this method given the filename and bucket
def download(fileName, s3folder):
    """Downloads file from s3"""
    s3.download_file(BUCKET_NAME, s3folder + "/" + fileName, fileName)

# walking throught the local directory calls upload helper method to handel every file that is encountered
def walkDirectory():
    global initializeMetadata
    cwd = os.getcwd()
    slash = cwd.rfind("/")
    lastSlash = (cwd[slash:])
    for root,dirs,files in os.walk(cwd):
        for name in files:
            path = os.path.join(root, name)
            firstSlash = path.find(lastSlash)
            fileToUpload = (path[firstSlash+1:])
            upload(path,"backups",fileToUpload) # call helper method and tell it to be placed in backups bucket

# Goes thorugh mem dictionary to check if any files have been deleted from the directory, if they have then
# it will be removed from the metadata and from AWS S3 bucket.
def walkMemoryCheck():
    global mem, initializeMetadata
    tempMem = mem.copy()
    cwd = os.getcwd()
    cwd = cwd[:cwd.rfind("/")]  # local path
    for key in tempMem:
        keyEdit = cwd+key[key.find("backups")+7:]
        found = os.path.exists(keyEdit)
        if found == False:
            print("Need to delete file from AWS and metadta:", key)
            del mem[key]
            try:
                s3.delete_object(Bucket=BUCKET_NAME, Key=key)
            except ClientError as e:
                print("Error in deleting file from s3:",e)

# If a metadata already exists then it is read into the mem dictionary, otherwise a new metadata file is opened
def readMetaData():
    global mem, initializeMetadata
    if os.path.exists("file_changes_metadata.txt"):
        lines = [line.rstrip('\n') for line in open("file_changes_metadata.txt")]
        for item in lines:
            split = item.split(", ")
            mem[split[0]] = float(split[1])
    else:
        file = open("file_changes_metadata.txt", "a")
        initializeMetadata = True   # need to remeber that this is new directory (all new files)
        print("Initializing new metadata document due to new directory")

# This method goes through the mem dictionary and writes the metadata to the txt document
def writeMetaData():
    global mem, initializeMetadata
    metadata = open("file_changes_metadata.txt", "w")
    for key in mem:
        metadata.write(key+", "+str(mem[key])+"\n")

# main - runs the methods in this order to make a full complete backup
readMetaData()
walkDirectory()
writeMetaData()
walkMemoryCheck()
writeMetaData()
print("Completed upload!")
