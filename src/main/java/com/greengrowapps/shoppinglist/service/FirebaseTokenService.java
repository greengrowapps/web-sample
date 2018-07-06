package com.greengrowapps.shoppinglist.service;

import com.greengrowapps.shoppinglist.domain.FirebaseToken;
import com.greengrowapps.shoppinglist.repository.FirebaseTokenRepository;
import com.greengrowapps.shoppinglist.service.dto.FirebaseTokenDTO;
import com.greengrowapps.shoppinglist.service.mapper.FirebaseTokenMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing FirebaseToken.
 */
@Service
@Transactional
public class FirebaseTokenService {

    private final Logger log = LoggerFactory.getLogger(FirebaseTokenService.class);

    private final FirebaseTokenRepository firebaseTokenRepository;

    private final FirebaseTokenMapper firebaseTokenMapper;

    public FirebaseTokenService(FirebaseTokenRepository firebaseTokenRepository, FirebaseTokenMapper firebaseTokenMapper) {
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.firebaseTokenMapper = firebaseTokenMapper;
    }

    /**
     * Save a firebaseToken.
     *
     * @param firebaseTokenDTO the entity to save
     * @return the persisted entity
     */
    public FirebaseTokenDTO save(FirebaseTokenDTO firebaseTokenDTO) {
        log.debug("Request to save FirebaseToken : {}", firebaseTokenDTO);
        FirebaseToken firebaseToken = firebaseTokenMapper.toEntity(firebaseTokenDTO);
        firebaseToken = firebaseTokenRepository.save(firebaseToken);
        return firebaseTokenMapper.toDto(firebaseToken);
    }

    /**
     * Get all the firebaseTokens.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<FirebaseTokenDTO> findAll() {
        log.debug("Request to get all FirebaseTokens");
        return firebaseTokenRepository.findAll().stream()
            .map(firebaseTokenMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one firebaseToken by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public FirebaseTokenDTO findOne(Long id) {
        log.debug("Request to get FirebaseToken : {}", id);
        FirebaseToken firebaseToken = firebaseTokenRepository.findOne(id);
        return firebaseTokenMapper.toDto(firebaseToken);
    }

    /**
     * Delete the firebaseToken by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete FirebaseToken : {}", id);
        firebaseTokenRepository.delete(id);
    }
}
