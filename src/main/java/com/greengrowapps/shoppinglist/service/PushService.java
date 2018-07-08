package com.greengrowapps.shoppinglist.service;

import com.greengrowapps.ggarest.GgaRest;
import com.greengrowapps.ggarest.Response;
import com.greengrowapps.ggarest.listeners.OnResponseListener;
import com.greengrowapps.shoppinglist.service.dto.FirebaseNotificationDTO;
import com.greengrowapps.shoppinglist.service.dto.FirebaseSendRequestDTO;
import com.greengrowapps.shoppinglist.service.dto.FirebaseTokenDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PushService {

    private final Logger log = LoggerFactory.getLogger(PushService.class);

    private static final String FIREBASE_API_URL = "https://fcm.googleapis.com/fcm/send";
    private FirebaseTokenService firebaseTokenService;
    private String firebaseServerKey;

    public PushService(FirebaseTokenService firebaseTokenService, @Value( "${spring.firebase.serverkey}" ) String firebaseServerKey) {
        this.firebaseTokenService = firebaseTokenService;
        this.firebaseServerKey = firebaseServerKey;
    }

    public void sendPushTo(long userId, String title, String message){
        List<FirebaseTokenDTO> tokens = firebaseTokenService.findAllForUser(userId);

        for (FirebaseTokenDTO token : tokens) {
            FirebaseSendRequestDTO sendRequest = new FirebaseSendRequestDTO();

            sendRequest.setTo(token.getToken());
            FirebaseNotificationDTO notificationDto = new FirebaseNotificationDTO();
            notificationDto.setTitle(title);
            notificationDto.setBody(message);
            sendRequest.setNotification(notificationDto);

            GgaRest.ws().post(FIREBASE_API_URL)
                .addHeader("Authorization", "key=" + firebaseServerKey)
                .addHeader("Content-Type", "application/json")
                .withBody(sendRequest)
                .onSuccess((i, response, e) -> log.debug("Success sending push: {}",response))
                .onOther((i, response, e) -> log.warn("Error sending push: {}",response))
                .execute();
        }
    }

}
