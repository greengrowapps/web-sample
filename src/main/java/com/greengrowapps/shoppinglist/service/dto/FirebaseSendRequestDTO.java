package com.greengrowapps.shoppinglist.service.dto;

public class FirebaseSendRequestDTO {

    private FirebaseNotificationDTO notification;
    private String to;

    public FirebaseNotificationDTO getNotification() {
        return notification;
    }

    public void setNotification(FirebaseNotificationDTO notification) {
        this.notification = notification;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String token) {
        this.to = token;
    }
}


