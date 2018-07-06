package com.greengrowapps.shoppinglist.web.rest;

import com.greengrowapps.shoppinglist.ShoppinglistApp;

import com.greengrowapps.shoppinglist.domain.FirebaseToken;
import com.greengrowapps.shoppinglist.repository.FirebaseTokenRepository;
import com.greengrowapps.shoppinglist.service.FirebaseTokenService;
import com.greengrowapps.shoppinglist.service.dto.FirebaseTokenDTO;
import com.greengrowapps.shoppinglist.service.mapper.FirebaseTokenMapper;
import com.greengrowapps.shoppinglist.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.greengrowapps.shoppinglist.web.rest.TestUtil.sameInstant;
import static com.greengrowapps.shoppinglist.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the FirebaseTokenResource REST controller.
 *
 * @see FirebaseTokenResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ShoppinglistApp.class)
public class FirebaseTokenResourceIntTest {

    private static final String DEFAULT_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_TOKEN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAST_UPDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_UPDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private FirebaseTokenRepository firebaseTokenRepository;

    @Autowired
    private FirebaseTokenMapper firebaseTokenMapper;

    @Autowired
    private FirebaseTokenService firebaseTokenService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFirebaseTokenMockMvc;

    private FirebaseToken firebaseToken;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FirebaseTokenResource firebaseTokenResource = new FirebaseTokenResource(firebaseTokenService);
        this.restFirebaseTokenMockMvc = MockMvcBuilders.standaloneSetup(firebaseTokenResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FirebaseToken createEntity(EntityManager em) {
        FirebaseToken firebaseToken = new FirebaseToken()
            .token(DEFAULT_TOKEN)
            .lastUpdate(DEFAULT_LAST_UPDATE);
        return firebaseToken;
    }

    @Before
    public void initTest() {
        firebaseToken = createEntity(em);
    }

    @Test
    @Transactional
    public void createFirebaseToken() throws Exception {
        int databaseSizeBeforeCreate = firebaseTokenRepository.findAll().size();

        // Create the FirebaseToken
        FirebaseTokenDTO firebaseTokenDTO = firebaseTokenMapper.toDto(firebaseToken);
        restFirebaseTokenMockMvc.perform(post("/api/firebase-tokens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(firebaseTokenDTO)))
            .andExpect(status().isCreated());

        // Validate the FirebaseToken in the database
        List<FirebaseToken> firebaseTokenList = firebaseTokenRepository.findAll();
        assertThat(firebaseTokenList).hasSize(databaseSizeBeforeCreate + 1);
        FirebaseToken testFirebaseToken = firebaseTokenList.get(firebaseTokenList.size() - 1);
        assertThat(testFirebaseToken.getToken()).isEqualTo(DEFAULT_TOKEN);
        assertThat(testFirebaseToken.getLastUpdate()).isEqualTo(DEFAULT_LAST_UPDATE);
    }

    @Test
    @Transactional
    public void createFirebaseTokenWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = firebaseTokenRepository.findAll().size();

        // Create the FirebaseToken with an existing ID
        firebaseToken.setId(1L);
        FirebaseTokenDTO firebaseTokenDTO = firebaseTokenMapper.toDto(firebaseToken);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFirebaseTokenMockMvc.perform(post("/api/firebase-tokens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(firebaseTokenDTO)))
            .andExpect(status().isBadRequest());

        // Validate the FirebaseToken in the database
        List<FirebaseToken> firebaseTokenList = firebaseTokenRepository.findAll();
        assertThat(firebaseTokenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFirebaseTokens() throws Exception {
        // Initialize the database
        firebaseTokenRepository.saveAndFlush(firebaseToken);

        // Get all the firebaseTokenList
        restFirebaseTokenMockMvc.perform(get("/api/firebase-tokens?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(firebaseToken.getId().intValue())))
            .andExpect(jsonPath("$.[*].token").value(hasItem(DEFAULT_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].lastUpdate").value(hasItem(sameInstant(DEFAULT_LAST_UPDATE))));
    }

    @Test
    @Transactional
    public void getFirebaseToken() throws Exception {
        // Initialize the database
        firebaseTokenRepository.saveAndFlush(firebaseToken);

        // Get the firebaseToken
        restFirebaseTokenMockMvc.perform(get("/api/firebase-tokens/{id}", firebaseToken.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(firebaseToken.getId().intValue()))
            .andExpect(jsonPath("$.token").value(DEFAULT_TOKEN.toString()))
            .andExpect(jsonPath("$.lastUpdate").value(sameInstant(DEFAULT_LAST_UPDATE)));
    }

    @Test
    @Transactional
    public void getNonExistingFirebaseToken() throws Exception {
        // Get the firebaseToken
        restFirebaseTokenMockMvc.perform(get("/api/firebase-tokens/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFirebaseToken() throws Exception {
        // Initialize the database
        firebaseTokenRepository.saveAndFlush(firebaseToken);
        int databaseSizeBeforeUpdate = firebaseTokenRepository.findAll().size();

        // Update the firebaseToken
        FirebaseToken updatedFirebaseToken = firebaseTokenRepository.findOne(firebaseToken.getId());
        // Disconnect from session so that the updates on updatedFirebaseToken are not directly saved in db
        em.detach(updatedFirebaseToken);
        updatedFirebaseToken
            .token(UPDATED_TOKEN)
            .lastUpdate(UPDATED_LAST_UPDATE);
        FirebaseTokenDTO firebaseTokenDTO = firebaseTokenMapper.toDto(updatedFirebaseToken);

        restFirebaseTokenMockMvc.perform(put("/api/firebase-tokens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(firebaseTokenDTO)))
            .andExpect(status().isOk());

        // Validate the FirebaseToken in the database
        List<FirebaseToken> firebaseTokenList = firebaseTokenRepository.findAll();
        assertThat(firebaseTokenList).hasSize(databaseSizeBeforeUpdate);
        FirebaseToken testFirebaseToken = firebaseTokenList.get(firebaseTokenList.size() - 1);
        assertThat(testFirebaseToken.getToken()).isEqualTo(UPDATED_TOKEN);
        assertThat(testFirebaseToken.getLastUpdate()).isEqualTo(UPDATED_LAST_UPDATE);
    }

    @Test
    @Transactional
    public void updateNonExistingFirebaseToken() throws Exception {
        int databaseSizeBeforeUpdate = firebaseTokenRepository.findAll().size();

        // Create the FirebaseToken
        FirebaseTokenDTO firebaseTokenDTO = firebaseTokenMapper.toDto(firebaseToken);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFirebaseTokenMockMvc.perform(put("/api/firebase-tokens")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(firebaseTokenDTO)))
            .andExpect(status().isCreated());

        // Validate the FirebaseToken in the database
        List<FirebaseToken> firebaseTokenList = firebaseTokenRepository.findAll();
        assertThat(firebaseTokenList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFirebaseToken() throws Exception {
        // Initialize the database
        firebaseTokenRepository.saveAndFlush(firebaseToken);
        int databaseSizeBeforeDelete = firebaseTokenRepository.findAll().size();

        // Get the firebaseToken
        restFirebaseTokenMockMvc.perform(delete("/api/firebase-tokens/{id}", firebaseToken.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FirebaseToken> firebaseTokenList = firebaseTokenRepository.findAll();
        assertThat(firebaseTokenList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FirebaseToken.class);
        FirebaseToken firebaseToken1 = new FirebaseToken();
        firebaseToken1.setId(1L);
        FirebaseToken firebaseToken2 = new FirebaseToken();
        firebaseToken2.setId(firebaseToken1.getId());
        assertThat(firebaseToken1).isEqualTo(firebaseToken2);
        firebaseToken2.setId(2L);
        assertThat(firebaseToken1).isNotEqualTo(firebaseToken2);
        firebaseToken1.setId(null);
        assertThat(firebaseToken1).isNotEqualTo(firebaseToken2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FirebaseTokenDTO.class);
        FirebaseTokenDTO firebaseTokenDTO1 = new FirebaseTokenDTO();
        firebaseTokenDTO1.setId(1L);
        FirebaseTokenDTO firebaseTokenDTO2 = new FirebaseTokenDTO();
        assertThat(firebaseTokenDTO1).isNotEqualTo(firebaseTokenDTO2);
        firebaseTokenDTO2.setId(firebaseTokenDTO1.getId());
        assertThat(firebaseTokenDTO1).isEqualTo(firebaseTokenDTO2);
        firebaseTokenDTO2.setId(2L);
        assertThat(firebaseTokenDTO1).isNotEqualTo(firebaseTokenDTO2);
        firebaseTokenDTO1.setId(null);
        assertThat(firebaseTokenDTO1).isNotEqualTo(firebaseTokenDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(firebaseTokenMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(firebaseTokenMapper.fromId(null)).isNull();
    }
}
