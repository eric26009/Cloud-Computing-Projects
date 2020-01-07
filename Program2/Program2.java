// Eric Feldman
// Assignment 2
// CSS 436 Cloud Computing
// October 20, 2019

import com.google.gson.annotations.SerializedName;
import java.util.Scanner;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.lang.*;
import com.google.gson.*;


public class Program2 {

    HttpClient client = null;
    String body = "";
    final static String apiKey = "REPLACE WITH OPENWEATHERMAP API KEY";
    final static String apiEndpoint = "http://api.openweathermap.org/data/2.5/";
    final static String currentWeatherAPI = "weather?q=";
    final static String forcastWeatherAPI = "forecast?zip=";

    public Program2() {
        // constructing the client
        client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .proxy(ProxySelector.getDefault())
                .build();
    }

    // returns the JSON message from for the given city name
    public String getWeather(String city){
        String apiLink = apiEndpoint+currentWeatherAPI+city+"&units=imperial"+"&APPID="+apiKey;
        HttpRequest request = null;
        try{
            request = HttpRequest.newBuilder().uri(URI.create(apiLink)).build();
        }
        catch (Exception e){
            System.out.println("Error in URL syntax:" + apiLink);
            System.exit(1);
        }
        HttpResponse<String> result = null;
        try {
            result = client.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.out.println("An error has occurred while accessing the specified API endpoint: "+apiLink);
            System.out.println("Relaunch application and try again!");
            System.exit(1);
        }
        return result.body();
    }

    // uses the Gson to extract the weather info from the JSON using the the JSON object classes templated
    public weather getData(String body){
        Gson gson = new Gson();
        weather data = gson.fromJson(body,weather.class);
        return  data;
    }

    // Parses the argument and calls the required methods to get the weather data for the city specified as the argument
    public static void main(String args[]){
        if(args.length != 1){
            System.out.println("You must provide exactly one city name as the parameter");
            return;
        }
        Program2 obj1 = new Program2();
        String cityName = args[0];
        char first = cityName.charAt(0);
        if(first >= 97){
            first-=32;
            cityName = cityName.substring(1);
            cityName =first+cityName;
        }
        // if the city name has a space in it, need to replace spaces with '%20' for API call to work
        String cityNameRegx = cityName.replaceAll("[\\s]+", "%20");
        System.out.println();
        String body = obj1.getWeather(cityNameRegx);
        weather data = obj1.getData(body);
        // attempt to print out all the basic info about the weather to the console
        try {
            if(data.cityName != null) System.out.println("Weather report for " + cityName + "\n");
            if(data.currentConditions != null) System.out.println(data.currentConditions.toString());
            if(data.cloudLevel != null) System.out.println(data.cloudLevel.toString());
            if(data.wind != null) System.out.println(data.wind.toString());
            if(data.latestRain != null) System.out.println(data.latestRain.toString());
            if(data.snow != null) System.out.println(data.snow.toString());

        }
        // Usually breaks if city name is invalid or one of the JSON objects was omitted by the API during the call
        catch (Exception e){
            System.out.println("The given city was not found!");
            System.out.println("Relaunch application and try again!");
        }
    }

    // Java object constructed to represent the entire JSON object retunred during the API call for current weather
    public class weather{
        @SerializedName("main")
        CurrentWeather currentConditions;
        @SerializedName("name")
        String cityName = "missing";
        @SerializedName("clouds")
        Clouds cloudLevel;
        @SerializedName("rain")
        Rain latestRain;
        Wind wind;
        Snow snow;
        int id = 0;

        public weather(CurrentWeather curr, String cityName, int id, Clouds cloudsInput, Wind windCond, Rain lastRain,
                       Snow snowAmount){
            this.currentConditions = curr;
            this.id = id;
            this.cityName = cityName;
            this.cloudLevel = cloudsInput;
            this.wind = windCond;
            this.latestRain = lastRain;
            this.snow = snowAmount;
        }
    }

    // Java object constructed to represent the JSON object for main in current weather
    public class CurrentWeather{
        private double temp=0;
        private double pressure=0;
        private String humidity="missing";

        public CurrentWeather(double temp, double pressure, String humidity){
            this.temp = temp;
            this.pressure = pressure;
            this.humidity = humidity;
        }

        public String toString(){
            String words = "";
            words+=("   Current Conditions:\n");
            words+=("       Temp: "+temp+" F\n");
            words+=("       Pressure: "+pressure+" hPa\n");
            words+=("       Humidity: "+humidity+" %");
            return words;
        }
    }

    // Java object constructed to represent the JSON object for cloud in current weather
    public class Clouds{
        @SerializedName("all")
        double cloudy=0;

        public Clouds(double howCloudy){
            this.cloudy = howCloudy;
        }

        public String toString(){
            String words = "";
            words+=("   Cloudiness: "+cloudy+" %");
            return  words;
        }
    }

    // Java object constructed to represent the JSON object for wind in current weather
    public class Wind{
        double speed = 0;
        double deg = 0;

        public Wind(double howWindy, double whatDeg){
            this.speed = howWindy;
            this.deg = whatDeg;
        }

        public String toString(){
            String words = "";
            words+=("   Wind Conditions:\n");
            words+=("       Speed: "+speed+" mph\n");
            words+=("       Wind Direction: "+deg+" degrees");
            return words;
        }
    }
    // Java object constructed to represent the JSON object for rain in current weather
    public class Rain{
        @SerializedName("1h")
        double oneHour = 0;
        @SerializedName("3h")
        double threeHour = 0;

        public Rain(double rain1, double rain3){
            this.oneHour = rain1;
            this.threeHour = rain3;
        }

        public String toString(){
            String words = "";
            words+=("   Recent Rain Conditions:\n");
            words+=("       Rain Volume for last 1 Hour: "+oneHour+" mm\n");
            words+=("       Rain Volume for last 3 Hours: "+threeHour+" mm\n");
            return words;
        }
    }

    // Java object constructed to represent the JSON object for snow in current weather
    // Does not appear in JSON unless it has snowed.. omitting for now
    public class Snow{
        @SerializedName("1h")
        double oneHour = 0;
        @SerializedName("3h")
        double threeHour = 0;

        public Snow(double snow1, double snow3){
            this.oneHour = snow1;
            this.threeHour = snow3;
        }

        public String toString(){
            String words = "";
            words+=("   Recent Rain Conditions:\n");
            words+=("       Snow Volume for last 1 Hour: "+oneHour+" mm\n");
            words+=("       Snow Volume for last 3 Hours: "+threeHour+" mm\n");
            return words;
        }
    }
}
