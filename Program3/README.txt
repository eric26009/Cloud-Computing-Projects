README
____________________

- This program imports the following modules (only boto3 may be required to install):
- This was built and tested using the Python 3.7

*************************************
import boto3
from botocore.errorfactory import ClientError
import os
import time
*************************************

* No command line arguments are required. This program will back up all flies and subdirectories from where this program is placed. So simply place 'backup.py' and 'key_file.txt' at the top most level in the directory you would like backed up.  

To build/run:

1. Open the file called 'key_file.txt' and replace the first line with your AWS_ACCESS_KEY_ID, the second line should be replaced with your AWS_SECRET_ACCESS_KEY. Lastly the third line should be replaced with BUCKET_NAME of the bucket at the highest level of your S3 directory. Using a sub bucket will not work. So it is essentially that you select a bucket at the root level of your s3. 

2. After editing the 'key_file.txt', in the command terminal run "python3 backup.py"
	* Nothing else is required, the program will execute backup operations to the cloud.

