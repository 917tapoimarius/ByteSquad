package com.bucketlist.chatGPT.service;

import com.bucketlist.chatGPT.model.ChatGPTChoice;
import com.bucketlist.chatGPT.model.ChatGPTRequest;
import com.bucketlist.chatGPT.model.ChatGPTResponse;
import com.bucketlist.chatGPT.model.SearchRequest;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@Slf4j
public class ChatGPTService {
    @Value("${OPEN_AI_URL}")
    private String OPEN_AI_URL;

    @Value("${OPEN_AI_KEY}")
    private String OPEN_AI_KEY;

    public String processSearch(String query) {
        //create a new ChatGPTRequest object with the given query
        ChatGPTRequest chatGPTRequest = new ChatGPTRequest();
        chatGPTRequest.setPrompt(query);

        String url = OPEN_AI_URL;

        //create an HTTP POST request
        HttpPost post = new HttpPost(url);
        post.addHeader("Content-Type", "application/json");
        post.addHeader("Authorization", "Bearer " + OPEN_AI_KEY);

        //create a Gson obj for JSON serialization and deserialization
        Gson gson = new Gson();

        //convert the request into JSON format
        String body = gson.toJson(chatGPTRequest);
        //log.info("body: " + body);

        try{
            //set the request entity with the JSON body
            final StringEntity entity = new StringEntity(body);
            post.setEntity(entity);

            //execute a HTTP POST request
            try (CloseableHttpClient httpClient = HttpClients.custom().build();
                 CloseableHttpResponse response = httpClient.execute(post)) {

                //read the response body as a string
                String responseBody = EntityUtils.toString(response.getEntity());
                //log.info("responseBody: " + responseBody );
                System.out.println("Before modification: " + responseBody);

                ChatGPTResponse chatGPTResponse = gson.fromJson(responseBody, ChatGPTResponse.class);
                if(chatGPTResponse != null && chatGPTResponse.getChoices() != null && !chatGPTResponse.getChoices().isEmpty()) {
                    for(ChatGPTChoice choice : chatGPTResponse.getChoices()) {
                        if(choice.getText() != null) {
                            choice.setText(choice.getText().replace("/(\\r\\n|\\n|\\r)/gm", "\\\\\\\\"));
                        }
                    }
                    System.out.println("Final Answer: " + chatGPTResponse.getChoices().get(0).getText().trim());
                    return chatGPTResponse.getChoices().get(0).getText().trim();
                }
                else {
                    return "Failed";
                }

            } catch (Exception e) {
                return "Failed";
            }
        } catch (Exception e) {
            return "Failed";
        }
    }

    public SearchRequest createSearchDestinationPrompt(String continent, String country, String month, String regionType,
                                                String season, String activities) {
        String rolePrompt = "Act as a travel agency. Suggest me one city to visit based on the preferences I give you. " +
                "I will give you the continent, the country, the month I want to visit, if it’s in the season or not " +
                "and the activities I want to have in the city or no further than 50 km away from it. You will offer" +
                " me as a response the city and no more than 2 activities I can do." +
                "Do not let me know I can ask follow up questions.";

        String destinationPrompt = "Continent: " + continent + '\n' +
                "Country: " + country + "\n" +
                "Region type: " + regionType + "\n" +
                "Month: " + month + "\n" +
                "Season: " + season + "\n" +
                "Activities: " + activities;

        SearchRequest destinationRequest = new SearchRequest();
        destinationRequest.setQuery(rolePrompt + "\n" + destinationPrompt);

        return destinationRequest;
    }
}
