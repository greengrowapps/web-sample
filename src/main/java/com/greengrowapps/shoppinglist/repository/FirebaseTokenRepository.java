package com.greengrowapps.shoppinglist.repository;

import com.greengrowapps.shoppinglist.domain.FirebaseToken;
import com.greengrowapps.shoppinglist.domain.User;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the FirebaseToken entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FirebaseTokenRepository extends JpaRepository<FirebaseToken, Long> {

    @Query("select firebase_token from FirebaseToken firebase_token where firebase_token.user.login = ?#{principal.username}")
    List<FirebaseToken> findByUserIsCurrentUser();

    List<FirebaseToken> findAllByUser(User user);
}
