// Eric Feldman
// CSS 436 Cloud Computing
// Programming Assignment 1
// October 10, 2019

import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.lang.*;

public class Program1 {
    // Constants for default constructor
    private final String URL = "http://courses.washington.edu/css502/dimpsey";
    private final int NUMHOPS = 5;

    // Instance variables
    String url = "";
    int numHops = 0;
    HttpClient client = null;
    String body = "";
    int numHopsTaken = 0;
    ArrayList<String> memory;
    String currentURL = "";

    // Default constructor using default URL and default number of hops
    public Program1() {
        url = URL;
        numHops = NUMHOPS;
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .proxy(ProxySelector.getDefault())
                .build();
        memory = new ArrayList<String>();
        memory.add(url);
    }

    // Constructor using specified URL and number of hops
    public Program1(String URLInput, int numHopsInput) {
        url = URLInput;
        numHops = numHopsInput;
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .proxy(ProxySelector.getDefault())
                .build();
        memory = new ArrayList<String>();
        memory.add(url);
    }

    // Creates a http request and returns the html body of the URL. Also reads the status code and
    // handles potential errors.
    private String getBody(String updatedURL) {
        HttpRequest request = null;
        try{
            request = HttpRequest.newBuilder().uri(URI.create(updatedURL)).build();
        }
        catch (Exception e){
            System.out.println("Error in URL syntax:" + updatedURL);
            System.exit(1);
        }
        HttpResponse<String> result = null;
        try {
            result = client.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.out.println("An error has occurred while accessing the specified website: "+updatedURL);
            System.exit(1);
        }
        int statusCode = result.statusCode();
        if(statusCode >= 400){
            System.out.println("Failure, status code "+ statusCode+" received. Codes in 400s or higher mean failure");
            System.out.println("An error has occurred while accessing the specified website: "+updatedURL);
            System.exit(1);
        }
        return result.body();
    }

    // Helper method to return the next a href URL within quotation marks. If an error occurs, 'error' is returned.
    // Stores new trimmed html body after reading each a href url.
    private String getHoppedURLHelper(){
        String newURL = null;
        int loc = body.indexOf("a href");
        if(loc != -1){
            String newBodyHref = body.substring(loc+7);
            int loc1 = newBodyHref.indexOf("\"");
            String trimmed = newBodyHref.substring(loc1+1);
            int end = trimmed.indexOf("\"");
            if(end == -1){
                return "error";
            }
            newURL = trimmed.substring(0, end);

            // checks if its a http or long enough
            if(newURL.length() <5||(!newURL.substring(0,4).equalsIgnoreCase("http"))){
                int find = body.indexOf("a href");
                if(find == -1){
                    return "error";
                }
                body = body.substring(find+6);
                getHoppedURLHelper();
                return getHoppedURLHelper();
            }
            boolean slash = false;
            char lastChar = newURL.charAt(newURL.length()-1);
            if(lastChar == '/'){
                slash = true;
                newURL = newURL.substring(0,newURL.length()-1);
            }
            currentURL = newURL;

            if(memory.contains(newURL) || memory.contains(newURL+"/")){
                body = body.substring(body.indexOf("a href")+6);
                getHoppedURLHelper();
            }
            if(!memory.contains(newURL)){
                memory.add(newURL);
                numHopsTaken++;
            }
            if(slash==true) newURL = newURL + "/";
            body = getBody(newURL);
            return newURL;
        }
        return "error";
    }

    // Calls helper method to get the a href url, for loops given number of hops parsing the String to
    // capture the desired url.
    public String getHoppedURL(){
        // if number of hops given is zero, then the original url is returned.
        if (numHops == 0){
            return url;
        }
        // first initial call to the URL starting with
        body = getBody(url);
        String newURL = "";
        String lastURL = url;
        for(int i=0; i<=numHops;i++){
            newURL = getHoppedURLHelper();
            if(newURL.equals("error")){
                if(numHopsTaken != 0) numHopsTaken--;
                return "Error! 'a href' not found in html body\nLast valid URL: " + lastURL;
            }
            i = numHopsTaken;
            lastURL = newURL;   // saving last known good url to be returned if number of hops exceeds a href urls.
        }
        return memory.get(memory.size()-1);
    }
    // Overloading method to display the original inputted parameters or defualt ones.
    public String toString() {
        return "Inputted URL: " + url + "\nInputted number of hops: " + numHops+"\n";
    }

    public static void main(String[] args) {
        Program1 obj1;
        // if no parameters given, then default ones will be used.
        if(args.length == 0){
            obj1 = new Program1();
        }
        else if(args.length == 1){
            System.out.println("Too few arguments. Enter 2 arguments, url and number of hops");
            return;
        }
        else if(args.length > 2){
            System.out.println("Too many arguments. Enter 2 arguments, url and number of hops");
            return;
        }
        else {
            obj1 = new Program1(args[0], Integer.parseInt(args[1]));
        }
        System.out.println(obj1.toString());
        String finalURL = obj1.getHoppedURL();
        System.out.println("OUTPUT ->  " + finalURL + "\nActual number of hops taken: " + obj1.numHopsTaken + "\n");
        System.out.println("Websites hopped through:");
        System.out.println(obj1.memory.toString()+ "\n");
        System.out.println("HTML Data:\n*******************************\n" + obj1.getBody(finalURL));
    }
}
