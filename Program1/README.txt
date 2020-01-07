README

** An executable is already included called Program1.class **
____________________

- This program imports the following modules (which are all part of the standard java distribution):
- This was built and tested using the latest Java JDK 13

*************************************
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.lang.*;
*************************************

To only run:

1. In the command terminal run "java Program1 URL hops"
    ** URL is the URL you want to visit, such as http://courses.washington.edu/css502/dimpsey
    ** hops is the number of hops you would like to go, such as 5



To build/run:

1. In the command terminal run "sh build.sh"
2. Next, in the command terminal run "java Program1 URL hops"
    - URL is the URL you want to visit, such as http://courses.washington.edu/css502/dimpsey
    - hops is the number of hops you would like to go, such as 5


