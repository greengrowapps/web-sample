package com.greengrowapps.shoppinglist.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.greengrowapps.shoppinglist.domain.User;
import com.greengrowapps.shoppinglist.security.AuthoritiesConstants;
import com.greengrowapps.shoppinglist.security.SecurityUtils;
import com.greengrowapps.shoppinglist.security.UserSecurityUtils;
import com.greengrowapps.shoppinglist.service.FirebaseTokenService;
import com.greengrowapps.shoppinglist.service.PushService;
import com.greengrowapps.shoppinglist.service.dto.FirebaseNotificationDTO;
import com.greengrowapps.shoppinglist.web.rest.errors.BadRequestAlertException;
import com.greengrowapps.shoppinglist.web.rest.util.HeaderUtil;
import com.greengrowapps.shoppinglist.service.dto.FirebaseTokenDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing FirebaseToken.
 */
@RestController
@RequestMapping("/api")
public class FirebaseTokenResource {

    private final Logger log = LoggerFactory.getLogger(FirebaseTokenResource.class);

    private static final String ENTITY_NAME = "firebaseToken";

    private final FirebaseTokenService firebaseTokenService;
    private UserSecurityUtils userSecurityUtils;
    private PushService pushService;

    public FirebaseTokenResource(FirebaseTokenService firebaseTokenService, UserSecurityUtils userSecurityUtils, PushService pushService) {
        this.firebaseTokenService = firebaseTokenService;
        this.userSecurityUtils = userSecurityUtils;
        this.pushService = pushService;
    }

    /**
     * POST  /firebase-tokens : Create a new firebaseToken.
     *
     * @param firebaseTokenDTO the firebaseTokenDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new firebaseTokenDTO, or with status 400 (Bad Request) if the firebaseToken has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/firebase-tokens")
    @Timed
    public ResponseEntity<FirebaseTokenDTO> createFirebaseToken(@RequestBody FirebaseTokenDTO firebaseTokenDTO) throws URISyntaxException {
        log.debug("REST request to save FirebaseToken : {}", firebaseTokenDTO);
        if (firebaseTokenDTO.getId() != null) {
            throw new BadRequestAlertException("A new firebaseToken cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FirebaseTokenDTO result = firebaseTokenService.save(firebaseTokenDTO);
        return ResponseEntity.created(new URI("/api/firebase-tokens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /firebase-tokens : Updates an existing firebaseToken.
     *
     * @param firebaseTokenDTO the firebaseTokenDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated firebaseTokenDTO,
     * or with status 400 (Bad Request) if the firebaseTokenDTO is not valid,
     * or with status 500 (Internal Server Error) if the firebaseTokenDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/firebase-tokens")
    @Timed
    public ResponseEntity<FirebaseTokenDTO> updateFirebaseToken(@RequestBody FirebaseTokenDTO firebaseTokenDTO) throws URISyntaxException {
        log.debug("REST request to update FirebaseToken : {}", firebaseTokenDTO);
        if (firebaseTokenDTO.getId() == null) {
            return createFirebaseToken(firebaseTokenDTO);
        }

        if(!SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
            User user = userSecurityUtils.GetCurrentUserOrThrowUnauthorized();
            firebaseTokenDTO.setUserId(user.getId());
        }

        FirebaseTokenDTO result = firebaseTokenService.save(firebaseTokenDTO);

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, firebaseTokenDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /firebase-tokens : get all the firebaseTokens.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of firebaseTokens in body
     */
    @GetMapping("/firebase-tokens")
    @Timed
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public List<FirebaseTokenDTO> getAllFirebaseTokens() {
        log.debug("REST request to get all FirebaseTokens");
        return firebaseTokenService.findAll();
        }

    /**
     * GET  /firebase-tokens/:id : get the "id" firebaseToken.
     *
     * @param id the id of the firebaseTokenDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the firebaseTokenDTO, or with status 404 (Not Found)
     */
    @GetMapping("/firebase-tokens/{id}")
    @Timed
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public ResponseEntity<FirebaseTokenDTO> getFirebaseToken(@PathVariable Long id) {
        log.debug("REST request to get FirebaseToken : {}", id);
        FirebaseTokenDTO firebaseTokenDTO = firebaseTokenService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(firebaseTokenDTO));
    }

    /**
     * DELETE  /firebase-tokens/:id : delete the "id" firebaseToken.
     *
     * @param id the id of the firebaseTokenDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/firebase-tokens/{id}")
    @Timed
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteFirebaseToken(@PathVariable Long id) {
        log.debug("REST request to delete FirebaseToken : {}", id);
        firebaseTokenService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/firebase-tokens/send-to-user/{id}")
    @Timed
    public ResponseEntity<FirebaseNotificationDTO> createFirebaseToken(@PathVariable Long id, @RequestBody FirebaseNotificationDTO notification) throws URISyntaxException {
        log.debug("REST request to send notification to user {} : {}", id, notification);
        if (notification == null) {
            throw new BadRequestAlertException("Notification is mandatory",ENTITY_NAME,"notification");
        }
        pushService.sendPushTo(id,notification.getTitle(),notification.getBody());
        return ResponseEntity.created(new URI("/api/firebase-tokens/send-to-user/" + id))
            .body(notification);
    }

}
