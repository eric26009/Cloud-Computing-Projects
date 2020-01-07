README

** An executable is already included called Program2.jar **
____________________

- This program imports the following modules (some of which are not part of the standard java distribution):
- This was built and tested using the latest Java JDK 13
- Need to build with the gson .jar included 

*************************************
import com.google.gson.annotations.SerializedName;
import java.util.Scanner;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.lang.*;
import com.google.gson.*;
*************************************

Using included jar file to run:

1. In the command terminal run "java -jar Program2.jar Seattle
	** Replace "Seattle" which the city you would like the weather for.
		* If the city name has two parts such as Hong Hong, enter it with quotes such as "Hong Kong" 

To build/run:

1. In the command terminal run "sh build.sh"
	* If the build script is causing issues, build using the command "javac -cp ./gson-2.8.6.jar Program2.java"

2. In the command terminal run "java -cp .:gson-2.8.6.jar Program2 Seattle"
    ** Replace "Seattle" which the city you would like the weather for.
	* If the city name has two parts such as Hong Hong, enter it with quotes such as "Hong Kong" 

